<script lang="ts">
  import { onMount } from 'svelte';
  import { getActiveSlots, type AdSlot } from '$lib/stores/contract';
  import { formatUsdcDisplay, formatAddress, timeAgo } from '$lib/utils';
  import { wallet } from '$lib/stores/wallet';
  import { EXPLORER_URL } from '$lib/contracts';

  let slots: AdSlot[] = $state([]);
  let isLoading = $state(true);

  onMount(async () => {
    try {
      slots = await getActiveSlots();
    } catch (err) {
      console.error('Failed to load slots:', err);
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
  <!-- Header -->
  <div class="mb-8 animate-resolve">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-3">
          <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 text-usdc">
            <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
          </svg>
          <span class="data-label">USDC Marketplace</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-abyss-50 tracking-tight">Ad Slots</h1>
        <p class="mt-1.5 text-sm text-abyss-400">
          Buy ad slots from registered agents. 100% goes to the seller. Zero fees.
        </p>
      </div>
      {#if !isLoading}
        <div class="flex items-center gap-4 text-xs text-abyss-500">
          <span class="font-mono font-tabular">{slots.length} active</span>
        </div>
      {/if}
    </div>
  </div>

  <!-- Content -->
  {#if isLoading}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each Array(6) as _, i}
        <div class="data-panel p-5 animate-panel" style="animation-delay: {i * 80}ms">
          <div class="flex items-center justify-between mb-4">
            <div class="skeleton h-3 w-16 rounded"></div>
            <div class="skeleton h-4 w-20 rounded"></div>
          </div>
          <div class="skeleton h-3 w-full mb-2 rounded"></div>
          <div class="skeleton h-3 w-3/4 mb-5 rounded"></div>
          <div class="flex justify-between">
            <div class="skeleton h-3 w-24 rounded"></div>
            <div class="skeleton h-3 w-12 rounded"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else if slots.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each slots as slot, i}
        <div
          class="data-panel flex flex-col animate-panel group"
          style="animation-delay: {i * 80}ms"
        >
          <!-- Top bar -->
          <div class="flex items-center justify-between px-5 py-3 border-b border-abyss-750/50">
            <span class="text-[11px] font-mono text-abyss-500">SLOT-{slot.id.toString().padStart(3, '0')}</span>
            <span class="usdc-amount text-sm">
              {formatUsdcDisplay(slot.priceUsdc)}
              <span class="text-usdc/50 text-xs ml-0.5">USDC</span>
            </span>
          </div>

          <!-- Description -->
          <div class="flex-1 px-5 py-4">
            <p class="text-sm text-abyss-200 leading-relaxed line-clamp-3">{slot.description}</p>
          </div>

          <!-- Footer -->
          <div class="px-5 py-3 border-t border-abyss-750/50 flex items-center justify-between">
            <a
              href="/agent/{slot.seller}"
              class="text-xs font-mono text-abyss-500 hover:text-signal-teal transition-colors"
            >
              {formatAddress(slot.seller)}
            </a>
            <span class="text-[11px] text-abyss-600">{timeAgo(slot.createdAt)}</span>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="data-panel shadow-card">
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 16 16" fill="currentColor" class="h-5 w-5">
            <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
          </svg>
        </div>
        <p class="text-sm text-abyss-300 mb-1">No active ad slots</p>
        <p class="text-xs text-abyss-500">Connect your wallet and be the first to list one.</p>
      </div>
    </div>
  {/if}
</div>
