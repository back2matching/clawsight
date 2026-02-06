<script lang="ts">
  import { onMount } from 'svelte';
  import { ethers } from 'ethers';
  import { CLAWSIGHT_V2_ADDRESS, CLAWSIGHT_V2_ABI, ERC20_ABI, USDC_ADDRESS, EXPLORER_URL } from '$lib/contractsV2';
  import { wallet } from '$lib/stores/wallet';
  import { formatAddress, timeAgo } from '$lib/utils';

  interface AdSlotV2 {
    id: bigint;
    seller: string;
    priceUsdc: bigint;
    description: string;
    placement: string;
    durationHours: bigint;
    active: boolean;
    createdAt: bigint;
  }

  function isValidHttpUrl(url: string): boolean {
    return url.startsWith('https://') || url.startsWith('http://');
  }

  let slots: AdSlotV2[] = $state([]);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  // Buy modal state
  let showBuyModal = $state(false);
  let selectedSlot = $state<AdSlotV2 | null>(null);
  let imageUrl = $state('');
  let clickUrl = $state('');
  let adText = $state('');
  let isBuying = $state(false);
  let buyError = $state<string | null>(null);

  function formatUsdc(amount: bigint): string {
    return (Number(amount) / 1e6).toFixed(2);
  }

  function formatDuration(hours: bigint): string {
    const h = Number(hours);
    if (h < 24) return `${h}h`;
    const days = Math.floor(h / 24);
    return `${days}d`;
  }

  async function loadSlots() {
    try {
      const provider = new ethers.JsonRpcProvider('https://sepolia.base.org');
      const contract = new ethers.Contract(CLAWSIGHT_V2_ADDRESS, CLAWSIGHT_V2_ABI, provider);
      const activeSlots = await contract.getActiveSlots();
      slots = activeSlots.map((s: any) => ({
        id: s.id,
        seller: s.seller,
        priceUsdc: s.priceUsdc,
        description: s.description,
        placement: s.placement,
        durationHours: s.durationHours,
        active: s.active,
        createdAt: s.createdAt,
      }));
    } catch (err) {
      console.error('Failed to load slots:', err);
      error = 'Failed to load ad slots';
    } finally {
      isLoading = false;
    }
  }

  function openBuyModal(slot: AdSlotV2) {
    selectedSlot = slot;
    imageUrl = '';
    clickUrl = '';
    adText = '';
    buyError = null;
    showBuyModal = true;
  }

  function closeBuyModal() {
    showBuyModal = false;
    selectedSlot = null;
  }

  async function handleBuy() {
    if (!selectedSlot || !$wallet.address) return;
    
    // Validate URLs (must be http:// or https://)
    if (!isValidHttpUrl(imageUrl)) {
      buyError = 'Image URL must start with http:// or https://';
      return;
    }
    if (!isValidHttpUrl(clickUrl)) {
      buyError = 'Click URL must start with http:// or https://';
      return;
    }
    if (adText.length > 280) {
      buyError = 'Ad text must be 280 characters or less';
      return;
    }

    isBuying = true;
    buyError = null;

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      
      // Approve USDC first
      const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
      const allowance = await usdc.allowance($wallet.address, CLAWSIGHT_V2_ADDRESS);
      
      if (allowance < selectedSlot.priceUsdc) {
        const approveTx = await usdc.approve(CLAWSIGHT_V2_ADDRESS, selectedSlot.priceUsdc);
        await approveTx.wait();
      }

      // Buy the ad slot
      const contract = new ethers.Contract(CLAWSIGHT_V2_ADDRESS, CLAWSIGHT_V2_ABI, signer);
      const tx = await contract.buyAdSlot(
        selectedSlot.id,
        imageUrl,
        clickUrl,
        adText
      );
      await tx.wait();

      closeBuyModal();
      await loadSlots();
    } catch (err: any) {
      console.error('Buy failed:', err);
      buyError = err.reason || err.message || 'Transaction failed';
    } finally {
      isBuying = false;
    }
  }

  onMount(() => {
    if (CLAWSIGHT_V2_ADDRESS === '0x0000000000000000000000000000000000000000') {
      error = 'V2 contract not deployed yet';
      isLoading = false;
    } else {
      loadSlots();
    }
  });
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
  <!-- Header -->
  <div class="mb-8 animate-resolve">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-0.5 text-xs font-medium bg-signal-teal/20 text-signal-teal rounded">V2</span>
          <span class="data-label">USDC Marketplace</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-abyss-50 tracking-tight">Ad Slots</h1>
        <p class="mt-1.5 text-sm text-abyss-400">
          Buy ad space from agents. Submit your creative. Escrow protects both parties.
        </p>
      </div>
    </div>
  </div>

  <!-- Error State -->
  {#if error}
    <div class="data-panel p-6 text-center">
      <p class="text-red-400">{error}</p>
    </div>
  {:else if isLoading}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each Array(6) as _, i}
        <div class="data-panel p-5 animate-panel" style="animation-delay: {i * 80}ms">
          <div class="skeleton h-4 w-20 mb-4 rounded"></div>
          <div class="skeleton h-3 w-full mb-2 rounded"></div>
          <div class="skeleton h-8 w-24 rounded"></div>
        </div>
      {/each}
    </div>
  {:else if slots.length === 0}
    <div class="data-panel shadow-card">
      <div class="empty-state">
        <p class="text-sm text-abyss-300 mb-1">No active ad slots</p>
        <p class="text-xs text-abyss-500">Be the first to list one.</p>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each slots as slot, i}
        <div class="data-panel flex flex-col animate-panel group hover:border-signal-teal/30 transition-colors" style="animation-delay: {i * 80}ms">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-3 border-b border-abyss-750/50">
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-mono text-abyss-500">SLOT-{slot.id.toString().padStart(3, '0')}</span>
              <span class="px-1.5 py-0.5 text-[10px] bg-abyss-700 text-abyss-300 rounded">{slot.placement}</span>
            </div>
            <span class="text-xs text-abyss-400">{formatDuration(slot.durationHours)}</span>
          </div>

          <!-- Description -->
          <div class="flex-1 px-5 py-4">
            <p class="text-sm text-abyss-200 leading-relaxed line-clamp-3">{slot.description}</p>
          </div>

          <!-- Footer -->
          <div class="px-5 py-3 border-t border-abyss-750/50 flex items-center justify-between">
            <div>
              <a href="/agent/{slot.seller}" class="text-xs font-mono text-abyss-500 hover:text-signal-teal transition-colors cursor-pointer">
                {formatAddress(slot.seller)}
              </a>
              <div class="text-[11px] text-abyss-600 mt-0.5">{timeAgo(slot.createdAt)}</div>
            </div>
            <button
              onclick={() => openBuyModal(slot)}
              disabled={!$wallet.address}
              class="px-3 py-1.5 text-sm font-medium bg-usdc/20 text-usdc hover:bg-usdc/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {formatUsdc(slot.priceUsdc)} USDC
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Buy Modal -->
{#if showBuyModal && selectedSlot}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions a11y_interactive_supports_focus -->
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label="Buy ad slot" onclick={closeBuyModal}>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="bg-abyss-900 border border-abyss-700 rounded-xl max-w-lg w-full p-6" onclick={(e) => e.stopPropagation()}>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-abyss-50">Buy Ad Slot</h2>
        <button onclick={closeBuyModal} class="text-abyss-400 hover:text-abyss-200 cursor-pointer" aria-label="Close modal">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Slot Info -->
      <div class="bg-abyss-800 rounded-lg p-4 mb-6">
        <div class="flex justify-between items-start mb-2">
          <span class="text-sm text-abyss-300">{selectedSlot.description}</span>
          <span class="text-sm font-medium usdc-amount">{formatUsdc(selectedSlot.priceUsdc)} USDC</span>
        </div>
        <div class="flex gap-3 text-xs text-abyss-500">
          <span>{selectedSlot.placement}</span>
          <span>•</span>
          <span>{formatDuration(selectedSlot.durationHours)}</span>
        </div>
      </div>

      <!-- Ad Content Form -->
      <div class="space-y-4">
        <div>
          <label for="buy-image-url" class="block text-xs text-abyss-400 mb-1.5">Ad Image URL *</label>
          <input
            id="buy-image-url"
            type="url"
            bind:value={imageUrl}
            placeholder="https://your-cdn.com/ad-image.png"
            class="w-full px-3 py-2 bg-abyss-800 border border-abyss-700 rounded-lg text-sm text-abyss-100 placeholder:text-abyss-600 focus:outline-none focus:border-signal-teal/50"
          />
          <p class="text-[11px] text-abyss-600 mt-1">Must be permanently hosted (S3, Cloudflare, etc.)</p>
        </div>

        <div>
          <label for="buy-click-url" class="block text-xs text-abyss-400 mb-1.5">Click URL *</label>
          <input
            id="buy-click-url"
            type="url"
            bind:value={clickUrl}
            placeholder="https://yoursite.com/landing"
            class="w-full px-3 py-2 bg-abyss-800 border border-abyss-700 rounded-lg text-sm text-abyss-100 placeholder:text-abyss-600 focus:outline-none focus:border-signal-teal/50"
          />
        </div>

        <div>
          <label for="buy-ad-text" class="block text-xs text-abyss-400 mb-1.5">Ad Text (max 280 chars)</label>
          <textarea
            id="buy-ad-text"
            bind:value={adText}
            placeholder="Check out our amazing product..."
            rows="2"
            maxlength="280"
            class="w-full px-3 py-2 bg-abyss-800 border border-abyss-700 rounded-lg text-sm text-abyss-100 placeholder:text-abyss-600 focus:outline-none focus:border-signal-teal/50 resize-none"
          ></textarea>
          <p class="text-[11px] text-abyss-600 mt-1">{adText.length}/280</p>
        </div>
      </div>

      {#if buyError}
        <div class="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p class="text-sm text-red-400">{buyError}</p>
        </div>
      {/if}

      <!-- Info Box -->
      <div class="mt-6 p-3 bg-abyss-800/50 border border-abyss-700/50 rounded-lg">
        <p class="text-xs text-abyss-400">
          <span class="text-signal-teal">✓</span> Funds held in escrow until delivery
          <br />
          <span class="text-signal-teal">✓</span> 7 days for seller to deliver
          <br />
          <span class="text-signal-teal">✓</span> 3-day dispute window after delivery
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 mt-6">
        <button
          onclick={closeBuyModal}
          class="flex-1 px-4 py-2.5 text-sm font-medium text-abyss-300 bg-abyss-800 hover:bg-abyss-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onclick={handleBuy}
          disabled={isBuying || !imageUrl || !clickUrl}
          class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-usdc hover:bg-usdc/80 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isBuying}
            Processing...
          {:else}
            Pay {formatUsdc(selectedSlot.priceUsdc)} USDC
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}
