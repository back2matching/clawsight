import { writable, derived } from 'svelte/store';
import { BrowserProvider } from 'ethers';

export type WalletState = {
  address: string | null;
  chainId: number | null;
  connected: boolean;
  connecting: boolean;
  error: string | null;
};

const initialState: WalletState = {
  address: null,
  chainId: null,
  connected: false,
  connecting: false,
  error: null,
};

export const wallet = writable<WalletState>(initialState);
export const provider = writable<BrowserProvider | null>(null);
export const signer = writable<JsonRpcSigner | null>(null);

export const shortAddress = derived(wallet, ($wallet) =>
  $wallet.address ? `${$wallet.address.slice(0, 6)}...${$wallet.address.slice(-4)}` : null
);

const TARGET_CHAIN_ID = 84532; // Base Sepolia

async function switchToBaseSepolia() {
  if (!window.ethereum) return;
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${TARGET_CHAIN_ID.toString(16)}` }],
    });
  } catch (switchError: unknown) {
    const err = switchError as { code?: number };
    if (err.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${TARGET_CHAIN_ID.toString(16)}`,
          chainName: 'Base Sepolia',
          nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://sepolia.base.org'],
          blockExplorerUrls: ['https://sepolia.basescan.org'],
        }],
      });
    }
  }
}

export async function connectWallet() {
  if (typeof window === 'undefined' || !window.ethereum) {
    wallet.set({ ...initialState, error: 'No wallet detected. Install MetaMask.' });
    return;
  }

  wallet.update((s) => ({ ...s, connecting: true, error: null }));

  try {
    const bp = new BrowserProvider(window.ethereum);
    const accounts = await bp.send('eth_requestAccounts', []);
    const network = await bp.getNetwork();
    const chainId = Number(network.chainId);

    if (chainId !== TARGET_CHAIN_ID) {
      await switchToBaseSepolia();
      const updatedNetwork = await bp.getNetwork();
      if (Number(updatedNetwork.chainId) !== TARGET_CHAIN_ID) {
        wallet.set({ ...initialState, error: 'Please switch to Base Sepolia' });
        return;
      }
    }

    const s = await bp.getSigner();
    provider.set(bp);
    signer.set(s);
    wallet.set({
      address: accounts[0],
      chainId: TARGET_CHAIN_ID,
      connected: true,
      connecting: false,
      error: null,
    });
  } catch (err: unknown) {
    const e = err as Error;
    wallet.set({ ...initialState, error: e.message || 'Connection failed' });
  }
}

export function disconnectWallet() {
  wallet.set(initialState);
  provider.set(null);
  signer.set(null);
}

// Listen for account/chain changes
export function initWalletListeners() {
  if (typeof window === 'undefined' || !window.ethereum) return;

  window.ethereum.on('accountsChanged', (...args: unknown[]) => {
    const accounts = args[0] as string[];
    if (!accounts || accounts.length === 0) {
      disconnectWallet();
    } else {
      wallet.update((s) => ({ ...s, address: accounts[0] }));
    }
  });

  window.ethereum.on('chainChanged', () => {
    window.location.reload();
  });
}
