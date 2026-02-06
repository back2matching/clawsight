// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Clawsight is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // --- Structs ---

    struct Agent {
        string moltbookHandle;
        uint256 registeredAt;
        bool exists;
    }

    struct AdSlot {
        uint256 id;
        address seller;
        uint256 priceUsdc;
        string description;
        bool active;
        bool sold;
        address buyer;
        uint256 createdAt;
        uint256 purchasedAt;
    }

    // --- Events ---

    event AgentRegistered(address indexed wallet, string moltbookHandle, uint256 timestamp);
    event ScoreUpdated(address indexed agent, uint256 oldScore, uint256 newScore);
    event AdSlotListed(uint256 indexed slotId, address indexed seller, uint256 priceUsdc, string description);
    event AdSlotPurchased(uint256 indexed slotId, address indexed buyer, address indexed seller, uint256 priceUsdc);
    event AdSlotCancelled(uint256 indexed slotId);
    event RevenueClaimed(address indexed agent, uint256 amount);
    event OracleUpdated(address indexed oldOracle, address indexed newOracle);

    // --- State ---

    IERC20 public usdc;
    address public oracle;

    mapping(address => Agent) public agents;
    mapping(address => uint256) public scores;
    mapping(string => bool) public handleTaken;
    address[] public agentList;

    mapping(uint256 => AdSlot) public adSlots;
    uint256 public nextSlotId;

    mapping(address => uint256) public balances;

    // --- Modifiers ---

    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle");
        _;
    }

    // --- Constructor ---

    constructor(address _usdc, address _oracle) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_oracle != address(0), "Invalid oracle address");
        usdc = IERC20(_usdc);
        oracle = _oracle;
    }

    // --- Agent Registry ---

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

    // --- Reputation ---

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

        // Copy into memory arrays for sorting
        address[] memory sortedAddrs = new address[](total);
        uint256[] memory sortedScores = new uint256[](total);

        for (uint256 i = 0; i < total; i++) {
            sortedAddrs[i] = agentList[i];
            sortedScores[i] = scores[agentList[i]];
        }

        // Simple selection sort for top N
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

        // Trim to requested count
        address[] memory topAddrs = new address[](resultCount);
        uint256[] memory topScores = new uint256[](resultCount);
        for (uint256 i = 0; i < resultCount; i++) {
            topAddrs[i] = sortedAddrs[i];
            topScores[i] = sortedScores[i];
        }

        return (topAddrs, topScores);
    }

    // --- Ad Marketplace ---

    function listAdSlot(uint256 priceUsdc, string calldata description) external whenNotPaused {
        require(agents[msg.sender].exists, "Must be registered");
        require(priceUsdc > 0, "Price must be > 0");
        bytes memory descBytes = bytes(description);
        require(descBytes.length >= 1 && descBytes.length <= 500, "Description must be 1-500 chars");

        uint256 slotId = nextSlotId++;

        adSlots[slotId] = AdSlot({
            id: slotId,
            seller: msg.sender,
            priceUsdc: priceUsdc,
            description: description,
            active: true,
            sold: false,
            buyer: address(0),
            createdAt: block.timestamp,
            purchasedAt: 0
        });

        emit AdSlotListed(slotId, msg.sender, priceUsdc, description);
    }

    function buyAdSlot(uint256 slotId) external nonReentrant whenNotPaused {
        AdSlot storage slot = adSlots[slotId];
        require(slot.active, "Slot not active");
        require(!slot.sold, "Already sold");
        require(slot.seller != msg.sender, "Cannot buy own slot");

        // CEI: State changes BEFORE external call
        slot.active = false;
        slot.sold = true;
        slot.buyer = msg.sender;
        slot.purchasedAt = block.timestamp;

        balances[slot.seller] += slot.priceUsdc;

        // External call last
        usdc.safeTransferFrom(msg.sender, address(this), slot.priceUsdc);

        emit AdSlotPurchased(slotId, msg.sender, slot.seller, slot.priceUsdc);
    }

    function cancelAdSlot(uint256 slotId) external whenNotPaused {
        AdSlot storage slot = adSlots[slotId];
        require(slot.seller == msg.sender, "Not seller");
        require(slot.active, "Not active");
        require(!slot.sold, "Already sold");

        slot.active = false;

        emit AdSlotCancelled(slotId);
    }

    function claimRevenue() external nonReentrant whenNotPaused {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");

        // CEI: Zero balance BEFORE external call
        balances[msg.sender] = 0;

        usdc.safeTransfer(msg.sender, amount);

        emit RevenueClaimed(msg.sender, amount);
    }

    function getAdSlot(uint256 slotId) external view returns (AdSlot memory) {
        return adSlots[slotId];
    }

    function getActiveSlots() external view returns (AdSlot[] memory) {
        // Count active slots
        uint256 activeCount = 0;
        for (uint256 i = 0; i < nextSlotId; i++) {
            if (adSlots[i].active && !adSlots[i].sold) {
                activeCount++;
            }
        }

        // Build result array
        AdSlot[] memory result = new AdSlot[](activeCount);
        uint256 idx = 0;
        for (uint256 i = 0; i < nextSlotId; i++) {
            if (adSlots[i].active && !adSlots[i].sold) {
                result[idx++] = adSlots[i];
            }
        }

        return result;
    }

    function getBalance(address agent) external view returns (uint256) {
        return balances[agent];
    }

    // --- Admin ---

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
