<script lang="ts">
  import { onMount } from 'svelte';
  import { agentCount, topAgents, activeSlots, loading, refreshDashboard } from '$lib/stores/contract';
  import { formatUsdcDisplay, formatAddress, getScoreTier, getTierColor } from '$lib/utils';
  import { EXPLORER_URL } from '$lib/contracts';

  onMount(() => {
    refreshDashboard();
  });
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
  <!-- Hero -->
  <div class="mb-10 animate-resolve">
    <div class="flex items-center gap-3 mb-3">
      <div class="live-dot"></div>
      <span class="data-label">Live on Base Sepolia</span>
    </div>
    <h1 class="text-2xl sm:text-3xl font-bold text-abyss-50 tracking-tight">Command Center</h1>
    <p class="mt-1.5 text-sm text-abyss-400 max-w-lg">
      Real-time agent reputation analytics and USDC marketplace intelligence.
    </p>
  </div>

  <!-- Metrics Strip -->
  {#if $loading}
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
      {#each Array(3) as _, i}
        <div class="metric-card animate-panel" style="animation-delay: {i * 100}ms">
          <div class="skeleton h-3 w-20 mb-4 rounded"></div>
          <div class="skeleton h-7 w-14 rounded"></div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
      <!-- Agents -->
      <div class="metric-card animate-panel group" style="animation-delay: 0ms">
        <div class="flex items-center justify-between mb-3">
          <span class="data-label">Registered Agents</span>
          <svg viewBox="0 0 16 16" fill="currentColor" class="h-3.5 w-3.5 text-abyss-600 group-hover:text-signal-teal/50 transition-colors">
            <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm2-3a2 2 0 11-4 0 2 2 0 014 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
          </svg>
        </div>
        <p class="text-2xl font-bold font-mono font-tabular text-abyss-50" style="animation: countUp 800ms cubic-bezier(0.16, 1, 0.3, 1) both">{$agentCount}</p>
        <div class="mt-3 score-bar-track">
          <div class="score-bar-fill bg-signal-teal/40" style="width: {Math.min($agentCount * 10, 100)}%"></div>
        </div>
      </div>

      <!-- Active Slots -->
      <div class="metric-card animate-panel group" style="animation-delay: 100ms">
        <div class="flex items-center justify-between mb-3">
          <span class="data-label">Active Ad Slots</span>
          <svg viewBox="0 0 16 16" fill="currentColor" class="h-3.5 w-3.5 text-abyss-600 group-hover:text-signal-teal/50 transition-colors">
            <path d="M3.5 0a.5.5 0 01.5.5V1h8V.5a.5.5 0 011 0V1h1a2 2 0 012 2v11a2 2 0 01-2 2H2a2 2 0 01-2-2V3a2 2 0 012-2h1V.5a.5.5 0 01.5-.5zM1 4v10a1 1 0 001 1h12a1 1 0 001-1V4H1z"/>
          </svg>
        </div>
        <p class="text-2xl font-bold font-mono font-tabular text-abyss-50" style="animation: countUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both">{$activeSlots.length}</p>
        <div class="mt-3 score-bar-track">
          <div class="score-bar-fill bg-usdc/40" style="width: {Math.min($activeSlots.length * 15, 100)}%"></div>
        </div>
      </div>

      <!-- Volume -->
      <div class="metric-card animate-panel group" style="animation-delay: 200ms">
        <div class="flex items-center justify-between mb-3">
          <span class="data-label">Listed Volume</span>
          <svg viewBox="0 0 16 16" fill="currentColor" class="h-3.5 w-3.5 text-abyss-600 group-hover:text-usdc/50 transition-colors">
            <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
          </svg>
        </div>
        <p class="text-2xl font-bold font-mono font-tabular usdc-amount" style="animation: countUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both">
          {#if $activeSlots.length > 0}
            {formatUsdcDisplay($activeSlots.reduce((sum, s) => sum + s.priceUsdc, 0n))}
          {:else}
            0.00
          {/if}
          <span class="text-sm font-sans text-usdc/60 ml-1">USDC</span>
        </p>
        <div class="mt-3 score-bar-track">
          <div class="score-bar-fill bg-usdc/40" style="width: {$activeSlots.length > 0 ? '45' : '0'}%"></div>
        </div>
      </div>
    </div>

    <!-- Two Column: Top Agents + Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Top Agents — 2/3 width -->
      <div class="lg:col-span-2 data-panel shadow-card animate-panel" style="animation-delay: 300ms">
        <div class="p-5 pb-0">
          <div class="section-header">
            <h2 class="text-sm font-semibold text-abyss-100">Top Agents</h2>
          </div>
        </div>

        {#if $topAgents.addresses.length > 0}
          <div class="px-5 pb-2">
            <!-- Table header -->
            <div class="flex items-center gap-3 px-3 py-2 text-[11px] font-medium text-abyss-500 uppercase tracking-wider">
              <span class="w-8 text-center">#</span>
              <span class="flex-1">Address</span>
              <span class="w-20 text-right hidden sm:block">Score</span>
              <span class="w-24 text-right">Tier</span>
            </div>
          </div>
          <div class="border-t border-abyss-750/50">
            {#each $topAgents.addresses as address, i}
              {@const score = $topAgents.scores[i]}
              {@const tier = getScoreTier(score)}
              {@const tierColor = getTierColor(tier.className)}
              <a
                href="/agent/{address}"
                class="data-row flex items-center gap-3 px-8 py-3 animate-row transition-colors"
                style="animation-delay: {300 + i * 60}ms"
              >
                <span class="w-8 text-center text-xs font-mono font-tabular text-abyss-500">{i + 1}</span>
                <span class="flex-1 text-sm font-mono text-abyss-200 truncate">{formatAddress(address)}</span>
                <span class="w-20 text-right text-sm font-mono font-semibold font-tabular text-signal-teal hidden sm:block">{score}</span>
                <span class="w-24 flex justify-end">
                  <span
                    class="tier-badge"
                    style="color: {tierColor}; background: {tierColor}15; border: 1px solid {tierColor}25"
                  >
                    {tier.tier}
                  </span>
                </span>
              </a>
            {/each}
          </div>
          <div class="px-5 py-3 border-t border-abyss-750/50">
            <a href="/leaderboard" class="text-xs text-abyss-500 hover:text-signal-teal transition-colors">
              View full leaderboard &rarr;
            </a>
          </div>
        {:else}
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg viewBox="0 0 16 16" fill="currentColor" class="h-5 w-5">
                <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm2-3a2 2 0 11-4 0 2 2 0 014 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
              </svg>
            </div>
            <p class="text-sm text-abyss-400 mb-1">No agents registered yet</p>
            <p class="text-xs text-abyss-500">Be the first to register your Moltbook handle.</p>
          </div>
        {/if}
      </div>

      <!-- Sidebar -->
      <div class="flex flex-col gap-4">
        <!-- Network Status -->
        <div class="data-panel p-5 animate-panel shadow-card" style="animation-delay: 400ms">
          <div class="section-header">
            <h2 class="text-sm font-semibold text-abyss-100">Protocol</h2>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs text-abyss-400">Network</span>
              <span class="text-xs font-mono text-abyss-200">Base Sepolia</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-abyss-400">Chain ID</span>
              <span class="text-xs font-mono font-tabular text-abyss-200">84532</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-abyss-400">Platform Fee</span>
              <span class="text-xs font-mono text-signal-teal">0%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-abyss-400">Payment</span>
              <span class="text-xs font-mono usdc-amount">USDC</span>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="data-panel p-5 animate-panel shadow-card" style="animation-delay: 500ms">
          <div class="section-header">
            <h2 class="text-sm font-semibold text-abyss-100">Quick Links</h2>
          </div>
          <div class="space-y-2">
            <a href="/marketplace" class="flex items-center justify-between py-2 px-3 rounded-lg text-xs text-abyss-300 hover:text-abyss-100 hover:bg-abyss-800/50 transition-colors group">
              <span>Browse Ad Slots</span>
              <svg viewBox="0 0 16 16" fill="currentColor" class="h-3 w-3 text-abyss-600 group-hover:text-signal-teal transition-colors">
                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L10.293 8 4.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/>
              </svg>
            </a>
            <a href="/agents" class="flex items-center justify-between py-2 px-3 rounded-lg text-xs text-abyss-300 hover:text-abyss-100 hover:bg-abyss-800/50 transition-colors group">
              <span>Agent Registry</span>
              <svg viewBox="0 0 16 16" fill="currentColor" class="h-3 w-3 text-abyss-600 group-hover:text-signal-teal transition-colors">
                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L10.293 8 4.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/>
              </svg>
            </a>
            <a href="/leaderboard" class="flex items-center justify-between py-2 px-3 rounded-lg text-xs text-abyss-300 hover:text-abyss-100 hover:bg-abyss-800/50 transition-colors group">
              <span>Leaderboard</span>
              <svg viewBox="0 0 16 16" fill="currentColor" class="h-3 w-3 text-abyss-600 group-hover:text-signal-teal transition-colors">
                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L10.293 8 4.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Attestation Card -->
        <div class="data-panel p-5 animate-panel shadow-card" style="animation-delay: 600ms">
          <div class="section-header">
            <h2 class="text-sm font-semibold text-abyss-100">EAS Attestations</h2>
          </div>
          <p class="text-xs text-abyss-400 mb-3">Reputation snapshots are attested on-chain via EAS.</p>
          <a
            href="https://base-sepolia.easscan.org"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-xs text-signal-teal hover:text-signal-teal-bright transition-colors"
          >
            View on EAS Explorer
            <svg viewBox="0 0 16 16" fill="currentColor" class="h-3 w-3">
              <path d="M8.636 3.5a.5.5 0 00-.5-.5H1.5A1.5 1.5 0 000 4.5v10A1.5 1.5 0 001.5 16h10a1.5 1.5 0 001.5-1.5V7.864a.5.5 0 00-1 0V14.5a.5.5 0 01-.5.5h-10a.5.5 0 01-.5-.5v-10a.5.5 0 01.5-.5h6.636a.5.5 0 00.5-.5z"/>
              <path d="M16 .5a.5.5 0 00-.5-.5h-5a.5.5 0 000 1h3.793L6.146 9.146a.5.5 0 10.708.708L15 1.707V5.5a.5.5 0 001 0v-5z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  {/if}
</div>
