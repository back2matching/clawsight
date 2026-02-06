<script lang="ts">
  import { wallet, shortAddress, connectWallet, disconnectWallet } from '$lib/stores/wallet';
</script>

{#if $wallet.connected && $shortAddress}
  <div class="flex items-center gap-2">
    <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-abyss-850 border border-abyss-700">
      <span class="live-dot"></span>
      <span class="text-xs font-mono text-abyss-200 font-tabular">{$shortAddress}</span>
    </div>
    <button
      onclick={disconnectWallet}
      aria-label="Disconnect wallet"
      class="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-abyss-700 text-abyss-400 hover:text-signal-red hover:border-signal-red/30 transition-all duration-200 cursor-pointer"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" class="h-3.5 w-3.5">
        <path d="M2 3a1 1 0 011-1h5a1 1 0 010 2H4v8h4a1 1 0 110 2H3a1 1 0 01-1-1V3z"/>
        <path d="M10.293 5.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414L11.586 8l-1.293-1.293a1 1 0 010-1.414z"/>
      </svg>
    </button>
  </div>
{:else}
  <button
    onclick={connectWallet}
    disabled={$wallet.connecting}
    class="group relative px-4 py-1.5 text-xs font-semibold rounded-lg bg-signal-teal/10 text-signal-teal border border-signal-teal/20 hover:bg-signal-teal/15 hover:border-signal-teal/40 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {#if $wallet.connecting}
      <span class="flex items-center gap-2">
        <svg class="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-20"/>
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        </svg>
        Connecting
      </span>
    {:else}
      Connect
    {/if}
  </button>
{/if}

{#if $wallet.error}
  <div class="absolute top-full right-0 mt-2 px-3 py-2 text-xs text-signal-red bg-abyss-900 border border-signal-red/20 rounded-lg shadow-elevated max-w-64">
    {$wallet.error}
  </div>
{/if}
