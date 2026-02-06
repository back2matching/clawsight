<script lang="ts">
  import { onMount } from 'svelte';
  import { ethers } from 'ethers';
  import { CLAWSIGHT_V2_ADDRESS, CLAWSIGHT_V2_ABI, USDC_ADDRESS, EXPLORER_URL, PurchaseStatus, PURCHASE_STATUS_LABELS, PURCHASE_STATUS_COLORS } from '$lib/contractsV2';
  import { wallet } from '$lib/stores/wallet';
  import { formatAddress } from '$lib/utils';

  interface Purchase {
    id: number;
    slotId: bigint;
    buyer: string;
    seller: string;
    priceUsdc: bigint;
    content: {
      imageUrl: string;
      clickUrl: string;
      text: string;
    };
    purchasedAt: bigint;
    deliveredAt: bigint;
    deliveryDeadline: bigint;
    status: number;
  }

  let buyerPurchases: Purchase[] = $state([]);
  let sellerPurchases: Purchase[] = $state([]);
  let balance = $state(0n);
  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let activeTab = $state<'bought' | 'sold'>('bought');
  let actionLoading = $state<number | null>(null);

  // Dispute modal
  let showDisputeModal = $state(false);
  let disputePurchaseId = $state<number | null>(null);
  let disputeReason = $state('');
  let disputeError = $state<string | null>(null);

  function formatUsdc(amount: bigint): string {
    return (Number(amount) / 1e6).toFixed(2);
  }

  function formatDate(timestamp: bigint): string {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  }

  function getStatusBadge(status: number) {
    return {
      label: PURCHASE_STATUS_LABELS[status as PurchaseStatus] || 'Unknown',
      color: PURCHASE_STATUS_COLORS[status as PurchaseStatus] || '#6b7280',
    };
  }

  function isValidHttpUrl(url: string): boolean {
    return url.startsWith('https://') || url.startsWith('http://');
  }

  function isContractDeployed(): boolean {
    return CLAWSIGHT_V2_ADDRESS !== '0x0000000000000000000000000000000000000000';
  }

  async function loadData() {
    if (!$wallet.address || !isContractDeployed()) {
      isLoading = false;
      if (!isContractDeployed()) error = 'V2 contract not deployed yet';
      return;
    }

    try {
      const provider = new ethers.JsonRpcProvider('https://sepolia.base.org');
      const contract = new ethers.Contract(CLAWSIGHT_V2_ADDRESS, CLAWSIGHT_V2_ABI, provider);

      const [buyer, seller, bal] = await Promise.all([
        contract.getPurchasesByBuyer($wallet.address),
        contract.getPurchasesBySeller($wallet.address),
        contract.getBalance($wallet.address),
      ]);

      buyerPurchases = buyer.map((p: any) => ({
        id: Number(p.id),
        slotId: p.slotId,
        buyer: p.buyer,
        seller: p.seller,
        priceUsdc: p.priceUsdc,
        content: {
          imageUrl: p.content.imageUrl,
          clickUrl: p.content.clickUrl,
          text: p.content.text,
        },
        purchasedAt: p.purchasedAt,
        deliveredAt: p.deliveredAt,
        deliveryDeadline: p.deliveryDeadline,
        status: Number(p.status),
      }));

      sellerPurchases = seller.map((p: any) => ({
        id: Number(p.id),
        slotId: p.slotId,
        buyer: p.buyer,
        seller: p.seller,
        priceUsdc: p.priceUsdc,
        content: {
          imageUrl: p.content.imageUrl,
          clickUrl: p.content.clickUrl,
          text: p.content.text,
        },
        purchasedAt: p.purchasedAt,
        deliveredAt: p.deliveredAt,
        deliveryDeadline: p.deliveryDeadline,
        status: Number(p.status),
      }));

      balance = bal;
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      error = 'Failed to load dashboard data';
    } finally {
      isLoading = false;
    }
  }

  async function markDelivered(purchaseId: number) {
    if (!$wallet.address) return;
    actionLoading = purchaseId;
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CLAWSIGHT_V2_ADDRESS, CLAWSIGHT_V2_ABI, signer);
      const tx = await contract.markDelivered(purchaseId);
      await tx.wait();
      await loadData();
    } catch (err: any) {
      console.error('Failed to mark delivered:', err);
    } finally {
      actionLoading = null;
    }
  }

  async function confirmDelivery(purchaseId: number) {
    if (!$wallet.address) return;
    actionLoading = purchaseId;
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CLAWSIGHT_V2_ADDRESS, CLAWSIGHT_V2_ABI, signer);
      const tx = await contract.confirmDelivery(purchaseId);
      await tx.wait();
      await loadData();
    } catch (err: any) {
      console.error('Failed to confirm delivery:', err);
    } finally {
      actionLoading = null;
    }
  }

  function openDisputeModal(purchaseId: number) {
    disputePurchaseId = purchaseId;
    disputeReason = '';
    disputeError = null;
    showDisputeModal = true;
  }

  function closeDisputeModal() {
    showDisputeModal = false;
    disputePurchaseId = null;
  }

  async function submitDispute() {
    if (!$wallet.address || disputePurchaseId === null) return;
    if (!disputeReason.trim()) {
      disputeError = 'Please provide a reason';
      return;
    }
    actionLoading = disputePurchaseId;
    disputeError = null;
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CLAWSIGHT_V2_ADDRESS, CLAWSIGHT_V2_ABI, signer);
      const tx = await contract.disputeDelivery(disputePurchaseId, disputeReason);
      await tx.wait();
      closeDisputeModal();
      await loadData();
    } catch (err: any) {
      console.error('Failed to dispute:', err);
      disputeError = err.reason || err.message || 'Transaction failed';
    } finally {
      actionLoading = null;
    }
  }

  async function claimRevenue() {
    if (!$wallet.address) return;
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CLAWSIGHT_V2_ADDRESS, CLAWSIGHT_V2_ABI, signer);
      const tx = await contract.claimRevenue();
      await tx.wait();
      await loadData();
    } catch (err: any) {
      console.error('Failed to claim revenue:', err);
    }
  }

  onMount(() => {
    if (!isContractDeployed()) {
      error = 'V2 contract not deployed yet';
      isLoading = false;
    } else {
      loadData();
    }
  });

  $effect(() => {
    if ($wallet.address && isContractDeployed()) {
      loadData();
    }
  });
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
  <!-- Header -->
  <div class="mb-8">
    <div class="flex items-center gap-2 mb-3">
      <span class="px-2 py-0.5 text-xs font-medium bg-signal-teal/20 text-signal-teal rounded">V2</span>
      <span class="data-label">Dashboard</span>
    </div>
    <h1 class="text-2xl sm:text-3xl font-bold text-abyss-50 tracking-tight">Your Ads</h1>
    <p class="mt-1.5 text-sm text-abyss-400">
      Track purchases, deliveries, and revenue.
    </p>
  </div>

  {#if error}
    <div class="data-panel p-6 text-center">
      <p class="text-red-400">{error}</p>
    </div>
  {:else if !$wallet.address}
    <div class="data-panel p-8 text-center">
      <p class="text-abyss-400">Connect your wallet to view your dashboard</p>
    </div>
  {:else}
    <!-- Balance Card -->
    <div class="data-panel p-5 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs text-abyss-500 mb-1">Available Balance</p>
          <p class="text-2xl font-bold usdc-amount">{formatUsdc(balance)} <span class="text-sm text-usdc/60">USDC</span></p>
        </div>
        {#if balance > 0n}
          <button
            onclick={claimRevenue}
            class="px-4 py-2 text-sm font-medium bg-usdc hover:bg-usdc/80 text-white rounded-lg transition-colors cursor-pointer"
          >
            Withdraw
          </button>
        {/if}
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        onclick={() => activeTab = 'bought'}
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer {activeTab === 'bought' ? 'bg-signal-teal/20 text-signal-teal' : 'text-abyss-400 hover:text-abyss-200'}"
      >
        Ads Bought ({buyerPurchases.length})
      </button>
      <button
        onclick={() => activeTab = 'sold'}
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer {activeTab === 'sold' ? 'bg-signal-teal/20 text-signal-teal' : 'text-abyss-400 hover:text-abyss-200'}"
      >
        Ads Sold ({sellerPurchases.length})
      </button>
    </div>

    <!-- Purchases List -->
    {#if isLoading}
      <div class="space-y-4">
        {#each Array(3) as _}
          <div class="data-panel p-5">
            <div class="skeleton h-4 w-32 mb-3 rounded"></div>
            <div class="skeleton h-3 w-full rounded"></div>
          </div>
        {/each}
      </div>
    {:else if activeTab === 'bought'}
      {#if buyerPurchases.length === 0}
        <div class="data-panel p-8 text-center">
          <p class="text-abyss-400">You haven't bought any ads yet</p>
          <a href="/marketplace-v2" class="text-sm text-signal-teal hover:underline mt-2 inline-block">Browse marketplace</a>
        </div>
      {:else}
        <div class="space-y-4">
          {#each buyerPurchases as purchase}
            {@const status = getStatusBadge(purchase.status)}
            <div class="data-panel p-5">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-sm font-medium text-abyss-100">Purchase #{purchase.id}</span>
                    <span
                      class="px-2 py-0.5 text-[10px] font-medium rounded"
                      style="background: {status.color}20; color: {status.color}"
                    >
                      {status.label}
                    </span>
                  </div>
                  <p class="text-xs text-abyss-500">Seller: {formatAddress(purchase.seller)}</p>
                </div>
                <span class="text-sm font-medium usdc-amount">{formatUsdc(purchase.priceUsdc)} USDC</span>
              </div>

              <!-- Ad Content Preview -->
              <div class="bg-abyss-800 rounded-lg p-3 mb-4">
                <div class="flex gap-4">
                  {#if purchase.content.imageUrl && isValidHttpUrl(purchase.content.imageUrl)}
                    <img
                      src={purchase.content.imageUrl}
                      alt="Ad preview"
                      class="w-20 h-20 object-cover rounded"
                      onerror={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                    />
                  {/if}
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-abyss-200 line-clamp-2">{purchase.content.text || 'No text'}</p>
                    {#if purchase.content.clickUrl && isValidHttpUrl(purchase.content.clickUrl)}
                      <a href={purchase.content.clickUrl} target="_blank" rel="noopener noreferrer" class="text-xs text-signal-teal hover:underline truncate block mt-1">
                        {purchase.content.clickUrl}
                      </a>
                    {/if}
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-between">
                <span class="text-xs text-abyss-500">Purchased {formatDate(purchase.purchasedAt)}</span>
                <div class="flex gap-2">
                  {#if purchase.status === PurchaseStatus.Delivered}
                    <button
                      onclick={() => openDisputeModal(purchase.id)}
                      disabled={actionLoading === purchase.id}
                      class="px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Dispute
                    </button>
                  {/if}
                  {#if purchase.status === PurchaseStatus.Pending || purchase.status === PurchaseStatus.Delivered}
                    <button
                      onclick={() => confirmDelivery(purchase.id)}
                      disabled={actionLoading === purchase.id}
                      class="px-3 py-1.5 text-xs font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {actionLoading === purchase.id ? 'Processing...' : 'Confirm Delivery'}
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {:else}
      {#if sellerPurchases.length === 0}
        <div class="data-panel p-8 text-center">
          <p class="text-abyss-400">No one has bought your ads yet</p>
          <a href="/sell" class="text-sm text-signal-teal hover:underline mt-2 inline-block">Create an ad slot</a>
        </div>
      {:else}
        <div class="space-y-4">
          {#each sellerPurchases as purchase}
            {@const status = getStatusBadge(purchase.status)}
            <div class="data-panel p-5">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-sm font-medium text-abyss-100">Order #{purchase.id}</span>
                    <span
                      class="px-2 py-0.5 text-[10px] font-medium rounded"
                      style="background: {status.color}20; color: {status.color}"
                    >
                      {status.label}
                    </span>
                  </div>
                  <p class="text-xs text-abyss-500">Buyer: {formatAddress(purchase.buyer)}</p>
                </div>
                <span class="text-sm font-medium usdc-amount">{formatUsdc(purchase.priceUsdc)} USDC</span>
              </div>

              <!-- Ad Content to Display -->
              <div class="bg-abyss-800 rounded-lg p-3 mb-4">
                <p class="text-xs text-abyss-500 mb-2">Ad content to display:</p>
                <div class="flex gap-4">
                  {#if purchase.content.imageUrl && isValidHttpUrl(purchase.content.imageUrl)}
                    <a href={purchase.content.imageUrl} target="_blank" rel="noopener noreferrer">
                      <img
                        src={purchase.content.imageUrl}
                        alt="Ad creative"
                        class="w-20 h-20 object-cover rounded hover:opacity-80 transition-opacity"
                        onerror={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                      />
                    </a>
                  {/if}
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-abyss-200">{purchase.content.text || 'No text'}</p>
                    {#if purchase.content.clickUrl && isValidHttpUrl(purchase.content.clickUrl)}
                      <a href={purchase.content.clickUrl} target="_blank" rel="noopener noreferrer" class="text-xs text-signal-teal hover:underline truncate block mt-1">
                        {purchase.content.clickUrl}
                      </a>
                    {/if}
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-between">
                <span class="text-xs text-abyss-500">
                  Deadline: {formatDate(purchase.deliveryDeadline)}
                </span>
                {#if purchase.status === PurchaseStatus.Pending}
                  <button
                    onclick={() => markDelivered(purchase.id)}
                    disabled={actionLoading === purchase.id}
                    class="px-3 py-1.5 text-xs font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading === purchase.id ? 'Processing...' : 'Mark Delivered'}
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  {/if}
</div>

<!-- Dispute Modal -->
{#if showDisputeModal && disputePurchaseId !== null}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions a11y_interactive_supports_focus -->
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label="Dispute purchase" onclick={closeDisputeModal}>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="bg-abyss-900 border border-abyss-700 rounded-xl max-w-lg w-full p-6" onclick={(e) => e.stopPropagation()}>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-abyss-50">Dispute Purchase #{disputePurchaseId}</h2>
        <button onclick={closeDisputeModal} class="text-abyss-400 hover:text-abyss-200 cursor-pointer" aria-label="Close modal">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="mb-4">
        <label for="dispute-reason" class="block text-xs text-abyss-400 mb-1.5">Reason for dispute *</label>
        <textarea
          id="dispute-reason"
          bind:value={disputeReason}
          placeholder="Describe why you're disputing this delivery..."
          rows="3"
          maxlength="500"
          class="w-full px-3 py-2 bg-abyss-800 border border-abyss-700 rounded-lg text-sm text-abyss-100 placeholder:text-abyss-600 focus:outline-none focus:border-signal-teal/50 resize-none"
        ></textarea>
        <p class="text-[11px] text-abyss-600 mt-1">{disputeReason.length}/500</p>
      </div>

      {#if disputeError}
        <div class="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p class="text-sm text-red-400">{disputeError}</p>
        </div>
      {/if}

      <div class="p-3 bg-abyss-800/50 border border-abyss-700/50 rounded-lg mb-6">
        <p class="text-xs text-abyss-400">
          <span class="text-amber-400">!</span> Disputes are reviewed by the oracle. If resolved in your favor, you'll receive a full refund.
        </p>
      </div>

      <div class="flex gap-3">
        <button
          onclick={closeDisputeModal}
          class="flex-1 px-4 py-2.5 text-sm font-medium text-abyss-300 bg-abyss-800 hover:bg-abyss-700 rounded-lg transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onclick={submitDispute}
          disabled={actionLoading !== null || !disputeReason.trim()}
          class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-500/80 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {actionLoading !== null ? 'Processing...' : 'Submit Dispute'}
        </button>
      </div>
    </div>
  </div>
{/if}
