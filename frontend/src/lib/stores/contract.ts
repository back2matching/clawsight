import { writable } from 'svelte/store';
import { Contract, JsonRpcProvider } from 'ethers';
import { CLAWSIGHT_ABI, CLAWSIGHT_ADDRESS, ERC20_ABI, USDC_ADDRESS, RPC_URL } from '$lib/contracts';

// Read-only provider for fetching data without wallet
const readProvider = new JsonRpcProvider(RPC_URL);
const readContract = new Contract(CLAWSIGHT_ADDRESS, CLAWSIGHT_ABI, readProvider);

export type Agent = {
  moltbookHandle: string;
  registeredAt: bigint;
  exists: boolean;
};

export type AdSlot = {
  id: bigint;
  seller: string;
  priceUsdc: bigint;
  description: string;
  active: boolean;
  sold: boolean;
  buyer: string;
  createdAt: bigint;
  purchasedAt: bigint;
};

// Contract read functions
export async function getAgentCount(): Promise<number> {
  const count = await readContract.getAgentCount();
  return Number(count);
}

export async function getAgent(address: string): Promise<Agent> {
  const result = await readContract.getAgent(address);
  return {
    moltbookHandle: result.moltbookHandle,
    registeredAt: result.registeredAt,
    exists: result.exists,
  };
}

export async function getScore(address: string): Promise<number> {
  const score = await readContract.getScore(address);
  return Number(score);
}

export async function getTopAgents(count: number): Promise<{ addresses: string[]; scores: number[] }> {
  const [addresses, scores] = await readContract.getTopAgents(count);
  return {
    addresses: addresses as string[],
    scores: (scores as bigint[]).map((s) => Number(s)),
  };
}

export async function getActiveSlots(): Promise<AdSlot[]> {
  const slots = await readContract.getActiveSlots();
  return slots.map((s: AdSlot) => ({
    id: s.id,
    seller: s.seller,
    priceUsdc: s.priceUsdc,
    description: s.description,
    active: s.active,
    sold: s.sold,
    buyer: s.buyer,
    createdAt: s.createdAt,
    purchasedAt: s.purchasedAt,
  }));
}

export async function getAdSlot(slotId: number): Promise<AdSlot> {
  const s = await readContract.getAdSlot(slotId);
  return {
    id: s.id,
    seller: s.seller,
    priceUsdc: s.priceUsdc,
    description: s.description,
    active: s.active,
    sold: s.sold,
    buyer: s.buyer,
    createdAt: s.createdAt,
    purchasedAt: s.purchasedAt,
  };
}

export async function isRegistered(address: string): Promise<boolean> {
  return await readContract.isRegistered(address);
}

export async function getBalance(address: string): Promise<bigint> {
  return await readContract.getBalance(address);
}

export async function getNextSlotId(): Promise<number> {
  const id = await readContract.nextSlotId();
  return Number(id);
}

// Write functions (need signer)
export function getWriteContract(signer: import('ethers').JsonRpcSigner) {
  return new Contract(CLAWSIGHT_ADDRESS, CLAWSIGHT_ABI, signer);
}

export function getUsdcContract(signer: import('ethers').JsonRpcSigner) {
  return new Contract(USDC_ADDRESS, ERC20_ABI, signer);
}

// Reactive stores for dashboard data
export const agentCount = writable<number>(0);
export const topAgents = writable<{ addresses: string[]; scores: number[] }>({ addresses: [], scores: [] });
export const activeSlots = writable<AdSlot[]>([]);
export const loading = writable<boolean>(true);

export async function refreshDashboard() {
  loading.set(true);
  try {
    const [count, top, slots] = await Promise.all([
      getAgentCount(),
      getTopAgents(10),
      getActiveSlots(),
    ]);
    agentCount.set(count);
    topAgents.set(top);
    activeSlots.set(slots);
  } catch (err) {
    console.error('Failed to refresh dashboard:', err);
  } finally {
    loading.set(false);
  }
}
