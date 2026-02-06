// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ClawsightV2
 * @notice On-chain ad marketplace for AI agents with actual ad content delivery
 * @dev V2 adds: AdContent struct, delivery tracking, escrow release, dispute window
 */
contract ClawsightV2 is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ============ Structs ============

    struct Agent {
        string moltbookHandle;
        uint256 registeredAt;
        bool exists;
    }

    struct AdSlot {
        uint256 id;
        address seller;
        uint256 priceUsdc;
        string description;      // What the seller offers (e.g. "Featured in my Moltbook posts for 7 days")
        string placement;        // Where ad will appear (e.g. "moltbook", "chatr.ai", "twitter")
        uint256 durationHours;   // How long the ad runs
        bool active;
        uint256 createdAt;
    }

    struct AdContent {
        string imageUrl;         // Ad creative URL (must be permanent hosting)
        string clickUrl;         // Where clicks go
        string text;             // Ad copy (max 280 chars)
    }

    struct Purchase {
        uint256 slotId;
        address buyer;
        address seller;
        uint256 priceUsdc;
        AdContent content;
        uint256 purchasedAt;
        uint256 deliveryDeadline;
        PurchaseStatus status;
    }

    enum PurchaseStatus {
        Pending,        // Bought, waiting for delivery
        Delivered,      // Seller marked as delivered
        Confirmed,      // Buyer confirmed (funds released)
        Disputed,       // Buyer disputed
        Refunded,       // Dispute resolved in buyer's favor
        Completed       // Auto-completed after dispute window
    }

    // ============ Events ============

    event AgentRegistered(address indexed wallet, string moltbookHandle, uint256 timestamp);
    event ScoreUpdated(address indexed agent, uint256 oldScore, uint256 newScore);
    
    event AdSlotListed(
        uint256 indexed slotId, 
        address indexed seller, 
        uint256 priceUsdc, 
        string description,
        string placement,
        uint256 durationHours
    );
    event AdSlotCancelled(uint256 indexed slotId);
    
    event AdPurchased(
        uint256 indexed purchaseId,
        uint256 indexed slotId,
        address indexed buyer,
        address seller,
        uint256 priceUsdc
    );
    event AdDelivered(uint256 indexed purchaseId, address indexed seller);
    event AdConfirmed(uint256 indexed purchaseId, address indexed buyer);
    event AdDisputed(uint256 indexed purchaseId, address indexed buyer, string reason);
    event AdRefunded(uint256 indexed purchaseId, address indexed buyer, uint256 amount);
    event AdCompleted(uint256 indexed purchaseId);
    
    event RevenueClaimed(address indexed agent, uint256 amount);
    event OracleUpdated(address indexed oldOracle, address indexed newOracle);

    // ============ Constants ============

    uint256 public constant DELIVERY_WINDOW = 7 days;      // Seller has 7 days to deliver
    uint256 public constant DISPUTE_WINDOW = 3 days;       // Buyer has 3 days to dispute after delivery
    uint256 public constant MAX_TEXT_LENGTH = 280;
    uint256 public constant MAX_URL_LENGTH = 500;
    uint256 public constant MAX_DESCRIPTION_LENGTH = 500;

    // ============ State ============

    IERC20 public usdc;
    address public oracle;

    // Agent registry
    mapping(address => Agent) public agents;
    mapping(address => uint256) public scores;
    mapping(string => bool) public handleTaken;
    address[] public agentList;

    // Ad slots (templates sellers create)
    mapping(uint256 => AdSlot) public adSlots;
    uint256 public nextSlotId;

    // Purchases (actual ad buys with content)
    mapping(uint256 => Purchase) public purchases;
    uint256 public nextPurchaseId;

    // Balances (available to withdraw)
    mapping(address => uint256) public balances;
    
    // Escrow (locked until delivery confirmed)
    mapping(uint256 => uint256) public escrow;

    // ============ Modifiers ============

    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle");
        _;
    }

    // ============ Constructor ============

    constructor(address _usdc, address _oracle) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_oracle != address(0), "Invalid oracle address");
        usdc = IERC20(_usdc);
        oracle = _oracle;
    }

    // ============ Agent Registry ============

    function registerAgent(string calldata moltbookHandle) external whenNotPaused {
        require(!agents[msg.sender].exists, "Already registered");
        bytes memory handleBytes = bytes(moltbookHandle);
        require(handleBytes.length >= 3 && handleBytes.length <= 50, "Handle must be 3-50 chars");
        require(!handleTaken[moltbookHandle], "Handle taken");

        agents[msg.sender] = Agent({
            moltbookHandle: moltbookHandle,
            registeredAt: block.timestamp,
            exists: true
        });
        handleTaken[moltbookHandle] = true;
        agentList.push(msg.sender);

        emit AgentRegistered(msg.sender, moltbookHandle, block.timestamp);
    }

    function getAgent(address wallet) external view returns (Agent memory) {
        return agents[wallet];
    }

    function isRegistered(address wallet) external view returns (bool) {
        return agents[wallet].exists;
    }

    function getAgentCount() external view returns (uint256) {
        return agentList.length;
    }

    // ============ Reputation ============

    function setScore(address agent, uint256 score) external onlyOracle whenNotPaused {
        require(agents[agent].exists, "Agent not registered");
        require(score <= 1000, "Score max 1000");

        uint256 oldScore = scores[agent];
        scores[agent] = score;

        emit ScoreUpdated(agent, oldScore, score);
    }

    function batchSetScores(
        address[] calldata _agents,
        uint256[] calldata newScores
    ) external onlyOracle whenNotPaused {
        require(_agents.length == newScores.length, "Length mismatch");

        for (uint256 i = 0; i < _agents.length; i++) {
            require(agents[_agents[i]].exists, "Agent not registered");
            require(newScores[i] <= 1000, "Score max 1000");

            uint256 oldScore = scores[_agents[i]];
            scores[_agents[i]] = newScores[i];

            emit ScoreUpdated(_agents[i], oldScore, newScores[i]);
        }
    }

    function getScore(address agent) external view returns (uint256) {
        return scores[agent];
    }

    function getTopAgents(uint256 count) external view returns (address[] memory, uint256[] memory) {
        uint256 total = agentList.length;
        uint256 resultCount = count > total ? total : count;

        address[] memory sortedAddrs = new address[](total);
        uint256[] memory sortedScores = new uint256[](total);

        for (uint256 i = 0; i < total; i++) {
            sortedAddrs[i] = agentList[i];
            sortedScores[i] = scores[agentList[i]];
        }

        for (uint256 i = 0; i < resultCount; i++) {
            uint256 maxIdx = i;
            for (uint256 j = i + 1; j < total; j++) {
                if (sortedScores[j] > sortedScores[maxIdx]) {
                    maxIdx = j;
                }
            }
            if (maxIdx != i) {
                (sortedAddrs[i], sortedAddrs[maxIdx]) = (sortedAddrs[maxIdx], sortedAddrs[i]);
                (sortedScores[i], sortedScores[maxIdx]) = (sortedScores[maxIdx], sortedScores[i]);
            }
        }

        address[] memory topAddrs = new address[](resultCount);
        uint256[] memory topScores = new uint256[](resultCount);
        for (uint256 i = 0; i < resultCount; i++) {
            topAddrs[i] = sortedAddrs[i];
            topScores[i] = sortedScores[i];
        }

        return (topAddrs, topScores);
    }

    // ============ Ad Marketplace ============

    /**
     * @notice List an ad slot template for sale
     * @param priceUsdc Price in USDC (6 decimals)
     * @param description What you're offering
     * @param placement Where the ad will appear
     * @param durationHours How long the ad runs
     */
    function listAdSlot(
        uint256 priceUsdc,
        string calldata description,
        string calldata placement,
        uint256 durationHours
    ) external whenNotPaused {
        require(agents[msg.sender].exists, "Must be registered");
        require(priceUsdc > 0, "Price must be > 0");
        require(bytes(description).length >= 1 && bytes(description).length <= MAX_DESCRIPTION_LENGTH, "Invalid description");
        require(bytes(placement).length >= 1 && bytes(placement).length <= 100, "Invalid placement");
        require(durationHours > 0 && durationHours <= 720, "Duration must be 1-720 hours"); // Max 30 days

        uint256 slotId = nextSlotId++;

        adSlots[slotId] = AdSlot({
            id: slotId,
            seller: msg.sender,
            priceUsdc: priceUsdc,
            description: description,
            placement: placement,
            durationHours: durationHours,
            active: true,
            createdAt: block.timestamp
        });

        emit AdSlotListed(slotId, msg.sender, priceUsdc, description, placement, durationHours);
    }

    /**
     * @notice Buy an ad slot and submit your ad content
     * @param slotId The slot to buy
     * @param imageUrl URL to your ad image (permanent hosting required)
     * @param clickUrl Where clicks should go
     * @param text Ad copy (max 280 chars)
     */
    function buyAdSlot(
        uint256 slotId,
        string calldata imageUrl,
        string calldata clickUrl,
        string calldata text
    ) external nonReentrant whenNotPaused {
        AdSlot storage slot = adSlots[slotId];
        require(slot.active, "Slot not active");
        require(slot.seller != msg.sender, "Cannot buy own slot");
        
        // Validate ad content
        require(bytes(imageUrl).length > 0 && bytes(imageUrl).length <= MAX_URL_LENGTH, "Invalid image URL");
        require(bytes(clickUrl).length > 0 && bytes(clickUrl).length <= MAX_URL_LENGTH, "Invalid click URL");
        require(bytes(text).length <= MAX_TEXT_LENGTH, "Text too long");

        uint256 purchaseId = nextPurchaseId++;
        uint256 deliveryDeadline = block.timestamp + DELIVERY_WINDOW;

        purchases[purchaseId] = Purchase({
            slotId: slotId,
            buyer: msg.sender,
            seller: slot.seller,
            priceUsdc: slot.priceUsdc,
            content: AdContent({
                imageUrl: imageUrl,
                clickUrl: clickUrl,
                text: text
            }),
            purchasedAt: block.timestamp,
            deliveryDeadline: deliveryDeadline,
            status: PurchaseStatus.Pending
        });

        // Lock funds in escrow
        escrow[purchaseId] = slot.priceUsdc;

        // Transfer USDC to contract
        usdc.safeTransferFrom(msg.sender, address(this), slot.priceUsdc);

        emit AdPurchased(purchaseId, slotId, msg.sender, slot.seller, slot.priceUsdc);
    }

    /**
     * @notice Seller marks ad as delivered
     * @param purchaseId The purchase to mark delivered
     */
    function markDelivered(uint256 purchaseId) external whenNotPaused {
        Purchase storage purchase = purchases[purchaseId];
        require(purchase.seller == msg.sender, "Not seller");
        require(purchase.status == PurchaseStatus.Pending, "Not pending");

        purchase.status = PurchaseStatus.Delivered;

        emit AdDelivered(purchaseId, msg.sender);
    }

    /**
     * @notice Buyer confirms delivery, releasing funds to seller
     * @param purchaseId The purchase to confirm
     */
    function confirmDelivery(uint256 purchaseId) external whenNotPaused {
        Purchase storage purchase = purchases[purchaseId];
        require(purchase.buyer == msg.sender, "Not buyer");
        require(
            purchase.status == PurchaseStatus.Delivered || 
            purchase.status == PurchaseStatus.Pending,
            "Cannot confirm"
        );

        uint256 amount = escrow[purchaseId];
        escrow[purchaseId] = 0;
        purchase.status = PurchaseStatus.Confirmed;
        
        balances[purchase.seller] += amount;

        emit AdConfirmed(purchaseId, msg.sender);
    }

    /**
     * @notice Buyer disputes delivery (within dispute window)
     * @param purchaseId The purchase to dispute
     * @param reason Why you're disputing
     */
    function disputeDelivery(uint256 purchaseId, string calldata reason) external whenNotPaused {
        Purchase storage purchase = purchases[purchaseId];
        require(purchase.buyer == msg.sender, "Not buyer");
        require(purchase.status == PurchaseStatus.Delivered, "Not delivered");
        require(
            block.timestamp <= purchase.purchasedAt + DELIVERY_WINDOW + DISPUTE_WINDOW,
            "Dispute window passed"
        );
        require(bytes(reason).length > 0 && bytes(reason).length <= 500, "Invalid reason");

        purchase.status = PurchaseStatus.Disputed;

        emit AdDisputed(purchaseId, msg.sender, reason);
    }

    /**
     * @notice Oracle resolves dispute in buyer's favor (refund)
     * @param purchaseId The disputed purchase
     */
    function resolveDisputeForBuyer(uint256 purchaseId) external onlyOracle {
        Purchase storage purchase = purchases[purchaseId];
        require(purchase.status == PurchaseStatus.Disputed, "Not disputed");

        uint256 amount = escrow[purchaseId];
        escrow[purchaseId] = 0;
        purchase.status = PurchaseStatus.Refunded;

        // Refund buyer
        usdc.safeTransfer(purchase.buyer, amount);

        emit AdRefunded(purchaseId, purchase.buyer, amount);
    }

    /**
     * @notice Oracle resolves dispute in seller's favor (release funds)
     * @param purchaseId The disputed purchase
     */
    function resolveDisputeForSeller(uint256 purchaseId) external onlyOracle {
        Purchase storage purchase = purchases[purchaseId];
        require(purchase.status == PurchaseStatus.Disputed, "Not disputed");

        uint256 amount = escrow[purchaseId];
        escrow[purchaseId] = 0;
        purchase.status = PurchaseStatus.Completed;

        balances[purchase.seller] += amount;

        emit AdCompleted(purchaseId);
    }

    /**
     * @notice Auto-complete purchase after dispute window (if no dispute)
     * @param purchaseId The purchase to complete
     */
    function autoComplete(uint256 purchaseId) external whenNotPaused {
        Purchase storage purchase = purchases[purchaseId];
        require(purchase.status == PurchaseStatus.Delivered, "Not delivered");
        require(
            block.timestamp > purchase.purchasedAt + DELIVERY_WINDOW + DISPUTE_WINDOW,
            "Dispute window not passed"
        );

        uint256 amount = escrow[purchaseId];
        escrow[purchaseId] = 0;
        purchase.status = PurchaseStatus.Completed;

        balances[purchase.seller] += amount;

        emit AdCompleted(purchaseId);
    }

    /**
     * @notice Auto-refund if seller doesn't deliver in time
     * @param purchaseId The purchase to refund
     */
    function autoRefund(uint256 purchaseId) external whenNotPaused {
        Purchase storage purchase = purchases[purchaseId];
        require(purchase.status == PurchaseStatus.Pending, "Not pending");
        require(block.timestamp > purchase.deliveryDeadline, "Delivery deadline not passed");

        uint256 amount = escrow[purchaseId];
        escrow[purchaseId] = 0;
        purchase.status = PurchaseStatus.Refunded;

        usdc.safeTransfer(purchase.buyer, amount);

        emit AdRefunded(purchaseId, purchase.buyer, amount);
    }

    function cancelAdSlot(uint256 slotId) external whenNotPaused {
        AdSlot storage slot = adSlots[slotId];
        require(slot.seller == msg.sender, "Not seller");
        require(slot.active, "Not active");

        slot.active = false;

        emit AdSlotCancelled(slotId);
    }

    function claimRevenue() external nonReentrant whenNotPaused {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");

        balances[msg.sender] = 0;
        usdc.safeTransfer(msg.sender, amount);

        emit RevenueClaimed(msg.sender, amount);
    }

    // ============ View Functions ============

    function getAdSlot(uint256 slotId) external view returns (AdSlot memory) {
        return adSlots[slotId];
    }

    function getPurchase(uint256 purchaseId) external view returns (Purchase memory) {
        return purchases[purchaseId];
    }

    function getActiveSlots() external view returns (AdSlot[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < nextSlotId; i++) {
            if (adSlots[i].active) {
                activeCount++;
            }
        }

        AdSlot[] memory result = new AdSlot[](activeCount);
        uint256 idx = 0;
        for (uint256 i = 0; i < nextSlotId; i++) {
            if (adSlots[i].active) {
                result[idx++] = adSlots[i];
            }
        }

        return result;
    }

    function getPurchasesByBuyer(address buyer) external view returns (Purchase[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < nextPurchaseId; i++) {
            if (purchases[i].buyer == buyer) {
                count++;
            }
        }

        Purchase[] memory result = new Purchase[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < nextPurchaseId; i++) {
            if (purchases[i].buyer == buyer) {
                result[idx++] = purchases[i];
            }
        }

        return result;
    }

    function getPurchasesBySeller(address seller) external view returns (Purchase[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < nextPurchaseId; i++) {
            if (purchases[i].seller == seller) {
                count++;
            }
        }

        Purchase[] memory result = new Purchase[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < nextPurchaseId; i++) {
            if (purchases[i].seller == seller) {
                result[idx++] = purchases[i];
            }
        }

        return result;
    }

    function getBalance(address agent) external view returns (uint256) {
        return balances[agent];
    }

    function getEscrow(uint256 purchaseId) external view returns (uint256) {
        return escrow[purchaseId];
    }

    // ============ Admin ============

    function setOracle(address newOracle) external onlyOwner {
        require(newOracle != address(0), "Invalid oracle address");
        address oldOracle = oracle;
        oracle = newOracle;

        emit OracleUpdated(oldOracle, newOracle);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
