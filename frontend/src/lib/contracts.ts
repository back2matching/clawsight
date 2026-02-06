export const CLAWSIGHT_ADDRESS = '0x497cA2E521887d250730EAeD777A3998CC74e21a';
export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
export const CHAIN_ID = 84532;
export const RPC_URL = 'https://sepolia.base.org';
export const EXPLORER_URL = 'https://sepolia.basescan.org';

export const CLAWSIGHT_ABI = [
  'function registerAgent(string moltbookHandle) external',
  'function getAgent(address wallet) external view returns (tuple(string moltbookHandle, uint256 registeredAt, bool exists))',
  'function isRegistered(address wallet) external view returns (bool)',
  'function getAgentCount() external view returns (uint256)',
  'function setScore(address agent, uint256 score) external',
  'function batchSetScores(address[] _agents, uint256[] newScores) external',
  'function getScore(address agent) external view returns (uint256)',
  'function getTopAgents(uint256 count) external view returns (address[], uint256[])',
  'function listAdSlot(uint256 priceUsdc, string description) external',
  'function buyAdSlot(uint256 slotId) external',
  'function cancelAdSlot(uint256 slotId) external',
  'function claimRevenue() external',
  'function getAdSlot(uint256 slotId) external view returns (tuple(uint256 id, address seller, uint256 priceUsdc, string description, bool active, bool sold, address buyer, uint256 createdAt, uint256 purchasedAt))',
  'function getActiveSlots() external view returns (tuple(uint256 id, address seller, uint256 priceUsdc, string description, bool active, bool sold, address buyer, uint256 createdAt, uint256 purchasedAt)[])',
  'function getBalance(address agent) external view returns (uint256)',
  'function nextSlotId() external view returns (uint256)',
  'function oracle() external view returns (address)',
  'function owner() external view returns (address)',
  'function paused() external view returns (bool)',
  'function usdc() external view returns (address)',
  'event AgentRegistered(address indexed wallet, string moltbookHandle, uint256 timestamp)',
  'event ScoreUpdated(address indexed agent, uint256 oldScore, uint256 newScore)',
  'event AdSlotListed(uint256 indexed slotId, address indexed seller, uint256 priceUsdc, string description)',
  'event AdSlotPurchased(uint256 indexed slotId, address indexed buyer, address indexed seller, uint256 priceUsdc)',
  'event AdSlotCancelled(uint256 indexed slotId)',
  'event RevenueClaimed(address indexed agent, uint256 amount)',
] as const;

export const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
] as const;
