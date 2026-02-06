// V2 Contract - Deploy and update this address
export const CLAWSIGHT_V2_ADDRESS = '0x0000000000000000000000000000000000000000'; // TODO: Deploy and update
export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
export const CHAIN_ID = 84532;
export const RPC_URL = 'https://sepolia.base.org';
export const EXPLORER_URL = 'https://sepolia.basescan.org';

// V2 ABI with full ad delivery system
export const CLAWSIGHT_V2_ABI = [
  // Agent Registry
  'function registerAgent(string moltbookHandle) external',
  'function getAgent(address wallet) external view returns (tuple(string moltbookHandle, uint256 registeredAt, bool exists))',
  'function isRegistered(address wallet) external view returns (bool)',
  'function getAgentCount() external view returns (uint256)',
  
  // Reputation
  'function setScore(address agent, uint256 score) external',
  'function batchSetScores(address[] _agents, uint256[] newScores) external',
  'function getScore(address agent) external view returns (uint256)',
  'function getTopAgents(uint256 count) external view returns (address[], uint256[])',
  
  // Ad Slots (V2 - with placement and duration)
  'function listAdSlot(uint256 priceUsdc, string description, string placement, uint256 durationHours) external',
  'function cancelAdSlot(uint256 slotId) external',
  'function getAdSlot(uint256 slotId) external view returns (tuple(uint256 id, address seller, uint256 priceUsdc, string description, string placement, uint256 durationHours, bool active, uint256 createdAt))',
  'function getActiveSlots() external view returns (tuple(uint256 id, address seller, uint256 priceUsdc, string description, string placement, uint256 durationHours, bool active, uint256 createdAt)[])',
  
  // Purchases (V2 - with ad content, escrow, delivery tracking)
  'function buyAdSlot(uint256 slotId, string imageUrl, string clickUrl, string text) external',
  'function markDelivered(uint256 purchaseId) external',
  'function confirmDelivery(uint256 purchaseId) external',
  'function disputeDelivery(uint256 purchaseId, string reason) external',
  'function autoComplete(uint256 purchaseId) external',
  'function autoRefund(uint256 purchaseId) external',
  'function getPurchase(uint256 purchaseId) external view returns (tuple(uint256 id, uint256 slotId, address buyer, address seller, uint256 priceUsdc, tuple(string imageUrl, string clickUrl, string text) content, uint256 purchasedAt, uint256 deliveredAt, uint256 deliveryDeadline, uint8 status))',
  'function getPurchasesByBuyer(address buyer) external view returns (tuple(uint256 id, uint256 slotId, address buyer, address seller, uint256 priceUsdc, tuple(string imageUrl, string clickUrl, string text) content, uint256 purchasedAt, uint256 deliveredAt, uint256 deliveryDeadline, uint8 status)[])',
  'function getPurchasesBySeller(address seller) external view returns (tuple(uint256 id, uint256 slotId, address buyer, address seller, uint256 priceUsdc, tuple(string imageUrl, string clickUrl, string text) content, uint256 purchasedAt, uint256 deliveredAt, uint256 deliveryDeadline, uint8 status)[])',
  
  // Revenue
  'function claimRevenue() external',
  'function getBalance(address agent) external view returns (uint256)',
  'function getEscrow(uint256 purchaseId) external view returns (uint256)',
  
  // Admin
  'function oracle() external view returns (address)',
  'function owner() external view returns (address)',
  'function paused() external view returns (bool)',
  'function usdc() external view returns (address)',
  'function nextSlotId() external view returns (uint256)',
  'function nextPurchaseId() external view returns (uint256)',
  
  // Constants
  'function DELIVERY_WINDOW() external view returns (uint256)',
  'function DISPUTE_WINDOW() external view returns (uint256)',
  
  // Events
  'event AgentRegistered(address indexed wallet, string moltbookHandle, uint256 timestamp)',
  'event ScoreUpdated(address indexed agent, uint256 oldScore, uint256 newScore)',
  'event AdSlotListed(uint256 indexed slotId, address indexed seller, uint256 priceUsdc, string description, string placement, uint256 durationHours)',
  'event AdSlotCancelled(uint256 indexed slotId)',
  'event AdPurchased(uint256 indexed purchaseId, uint256 indexed slotId, address indexed buyer, address seller, uint256 priceUsdc)',
  'event AdDelivered(uint256 indexed purchaseId, address indexed seller)',
  'event AdConfirmed(uint256 indexed purchaseId, address indexed buyer)',
  'event AdDisputed(uint256 indexed purchaseId, address indexed buyer, string reason)',
  'event AdRefunded(uint256 indexed purchaseId, address indexed buyer, uint256 amount)',
  'event AdCompleted(uint256 indexed purchaseId)',
  'event RevenueClaimed(address indexed agent, uint256 amount)',
] as const;

export const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
] as const;

// Purchase status enum
export enum PurchaseStatus {
  Pending = 0,
  Delivered = 1,
  Confirmed = 2,
  Disputed = 3,
  Refunded = 4,
  Completed = 5,
}

export const PURCHASE_STATUS_LABELS: Record<PurchaseStatus, string> = {
  [PurchaseStatus.Pending]: 'Pending Delivery',
  [PurchaseStatus.Delivered]: 'Delivered',
  [PurchaseStatus.Confirmed]: 'Confirmed',
  [PurchaseStatus.Disputed]: 'Disputed',
  [PurchaseStatus.Refunded]: 'Refunded',
  [PurchaseStatus.Completed]: 'Completed',
};

export const PURCHASE_STATUS_COLORS: Record<PurchaseStatus, string> = {
  [PurchaseStatus.Pending]: '#f59e0b',    // amber
  [PurchaseStatus.Delivered]: '#3b82f6',  // blue
  [PurchaseStatus.Confirmed]: '#10b981',  // green
  [PurchaseStatus.Disputed]: '#ef4444',   // red
  [PurchaseStatus.Refunded]: '#6b7280',   // gray
  [PurchaseStatus.Completed]: '#10b981',  // green
};
