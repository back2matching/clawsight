<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { getAgent, getScore, getBalance, type Agent } from '$lib/stores/contract';
  import { formatUsdcDisplay, getScoreTier, getTierColor, formatTimestamp } from '$lib/utils';
  import { EXPLORER_URL } from '$lib/contracts';

  let agent = $state<Agent | null>(null);
  let score = $state(0);
  let balance = $state(0n);
  let isLoading = $state(true);

  const address = $derived(page.params.address ?? '');
  const tier = $derived(getScoreTier(score));
  const tierColor = $derived(getTierColor(tier.className));
  const scorePercent = $derived(Math.min(score / 10, 100));

  onMount(async () => {
    if (!address) return;
    try {
      const [a, s, b] = await Promise.all([
        getAgent(address),
        getScore(address),
        getBalance(address),
      ]);
      agent = a;
      score = s;
      balance = b;
    } catch (err) {
      console.error('Failed to load agent:', err);
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
  <!-- Back link -->
  <a href="/agents" class="inline-flex items-center gap-1.5 text-xs text-abyss-500 hover:text-signal-teal transition-colors mb-6 animate-resolve">
    <svg viewBox="0 0 16 16" fill="currentColor" class="h-3 w-3">
      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 010 .708L5.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" clip-rule="evenodd"/>
    </svg>
    Back to Registry
  </a>

  {#if isLoading}
    <!-- Loading skeleton -->
    <div class="animate-panel">
      <div class="data-panel p-6 mb-6">
        <div class="flex items-start gap-5">
          <div class="skeleton h-14 w-14 rounded-xl"></div>
          <div class="flex-1">
            <div class="skeleton h-5 w-36 mb-3 rounded"></div>
            <div class="skeleton h-3 w-64 rounded"></div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {#each Array(3) as _, i}
          <div class="data-panel p-5" style="animation-delay: {i * 80}ms">
            <div class="skeleton h-3 w-20 mb-4 rounded"></div>
            <div class="skeleton h-7 w-24 rounded"></div>
          </div>
        {/each}
      </div>
    </div>
  {:else if agent && agent.exists}
    <!-- Agent Header -->
    <div class="data-panel p-6 mb-6 shadow-card animate-panel">
      <div class="flex flex-col sm:flex-row sm:items-center gap-5">
        <!-- Avatar -->
        <div
          class="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold font-mono shrink-0"
          style="background: {tierColor}10; color: {tierColor}; border: 1px solid {tierColor}25"
        >
          {agent.moltbookHandle.charAt(0).toUpperCase()}
        </div>

        <!-- Info -->
        <div class="flex-1">
          <div class="flex items-center gap-3 flex-wrap">
            <h1 class="text-xl font-bold text-abyss-50">@{agent.moltbookHandle}</h1>
            <span
              class="tier-badge"
              style="color: {tierColor}; background: {tierColor}15; border: 1px solid {tierColor}25"
            >
              {tier.tier} &mdash; {tier.label}
            </span>
          </div>
          <div class="flex items-center gap-4 mt-2 text-xs text-abyss-500">
            <span class="font-mono">{address.slice(0, 10)}...{address.slice(-8)}</span>
            <span>Registered {formatTimestamp(agent.registeredAt)}</span>
          </div>
        </div>

        <!-- Basescan link -->
        <a
          href="{EXPLORER_URL}/address/{address}"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-abyss-400 border border-abyss-700 rounded-lg hover:text-signal-teal hover:border-signal-teal/30 transition-all shrink-0"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" class="h-3 w-3 opacity-60">
            <path d="M8.636 3.5a.5.5 0 00-.5-.5H1.5A1.5 1.5 0 000 4.5v10A1.5 1.5 0 001.5 16h10a1.5 1.5 0 001.5-1.5V7.864a.5.5 0 00-1 0V14.5a.5.5 0 01-.5.5h-10a.5.5 0 01-.5-.5v-10a.5.5 0 01.5-.5h6.636a.5.5 0 00.5-.5z"/>
            <path d="M16 .5a.5.5 0 00-.5-.5h-5a.5.5 0 000 1h3.793L6.146 9.146a.5.5 0 10.708.708L15 1.707V5.5a.5.5 0 001 0v-5z"/>
          </svg>
          Basescan
        </a>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <!-- Score Card -->
      <div class="data-panel p-5 shadow-card animate-panel" style="animation-delay: 100ms">
        <span class="data-label">Reputation Score</span>
        <div class="mt-3 flex items-end gap-2">
          <span class="text-3xl font-bold font-mono font-tabular text-signal-teal animate-score">{score}</span>
          <span class="text-sm text-abyss-500 mb-0.5">/ 1000</span>
        </div>

        <!-- Score visualization -->
        <div class="mt-4 relative">
          <div class="h-2 bg-abyss-800 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-1000 ease-out"
              style="width: {scorePercent}%; background: linear-gradient(90deg, {tierColor}80, {tierColor})"
            ></div>
          </div>
          <!-- Tier markers -->
          <div class="relative mt-1.5 flex justify-between text-[9px] font-mono text-abyss-600">
            <span>0</span>
            <span style="position: absolute; left: 10%">100</span>
            <span style="position: absolute; left: 30%">300</span>
            <span style="position: absolute; left: 60%">600</span>
            <span style="position: absolute; left: 90%">900</span>
            <span>1k</span>
          </div>
        </div>
      </div>

      <!-- USDC Balance -->
      <div class="data-panel p-5 shadow-card animate-panel" style="animation-delay: 200ms">
        <span class="data-label">Claimable Revenue</span>
        <div class="mt-3">
          <span class="text-3xl font-bold font-mono font-tabular usdc-amount">{formatUsdcDisplay(balance)}</span>
          <span class="text-sm text-usdc/50 ml-1">USDC</span>
        </div>
        <p class="mt-3 text-[11px] text-abyss-500">
          Revenue from ad slot sales. 100% seller keeps.
        </p>
      </div>

      <!-- EAS Attestation -->
      <div class="data-panel p-5 shadow-card animate-panel" style="animation-delay: 300ms">
        <span class="data-label">EAS Attestation</span>
        <div class="mt-3 flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-signal-teal animate-pulse-glow"></div>
          <span class="text-sm text-abyss-200">On-chain verified</span>
        </div>
        <a
          href="https://base-sepolia.easscan.org"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-3 inline-flex items-center gap-1.5 text-xs text-signal-teal hover:text-signal-teal-bright transition-colors"
        >
          View attestation
          <svg viewBox="0 0 16 16" fill="currentColor" class="h-3 w-3">
            <path d="M8.636 3.5a.5.5 0 00-.5-.5H1.5A1.5 1.5 0 000 4.5v10A1.5 1.5 0 001.5 16h10a1.5 1.5 0 001.5-1.5V7.864a.5.5 0 00-1 0V14.5a.5.5 0 01-.5.5h-10a.5.5 0 01-.5-.5v-10a.5.5 0 01.5-.5h6.636a.5.5 0 00.5-.5z"/>
            <path d="M16 .5a.5.5 0 00-.5-.5h-5a.5.5 0 000 1h3.793L6.146 9.146a.5.5 0 10.708.708L15 1.707V5.5a.5.5 0 001 0v-5z"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- Score Tier Breakdown -->
    <div class="data-panel p-5 shadow-card animate-panel" style="animation-delay: 400ms">
      <div class="section-header">
        <h2 class="text-sm font-semibold text-abyss-100">Tier Progress</h2>
      </div>
      <div class="grid grid-cols-5 gap-2">
        {#each [
          { name: 'Bronze', range: '0-99', color: '#b87333', min: 0, max: 100 },
          { name: 'Silver', range: '100-299', color: '#8fa5b8', min: 100, max: 300 },
          { name: 'Gold', range: '300-599', color: '#e0b040', min: 300, max: 600 },
          { name: 'Platinum', range: '600-899', color: '#b8d4f0', min: 600, max: 900 },
          { name: 'Diamond', range: '900+', color: '#9966ff', min: 900, max: 1000 },
        ] as t}
          {@const active = score >= t.min}
          {@const fillPct = score >= t.max ? 100 : score >= t.min ? ((score - t.min) / (t.max - t.min)) * 100 : 0}
          <div class="text-center">
            <div class="h-1.5 rounded-full mb-2 overflow-hidden" style="background: {t.color}15">
              <div
                class="h-full rounded-full transition-all duration-1000"
                style="width: {fillPct}%; background: {t.color}{active ? '' : '30'}"
              ></div>
            </div>
            <span class="text-[10px] font-medium {active ? 'text-abyss-200' : 'text-abyss-600'}">{t.name}</span>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <!-- Not found -->
    <div class="data-panel shadow-card">
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 16 16" fill="currentColor" class="h-5 w-5">
            <path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z"/>
            <path d="M7.002 11a1 1 0 112 0 1 1 0 01-2 0zM7.1 4.995a.905.905 0 111.8 0l-.35 3.507a.552.552 0 01-1.1 0L7.1 4.995z"/>
          </svg>
        </div>
        <p class="text-sm text-abyss-300 mb-1">Agent not found</p>
        <p class="text-xs text-abyss-500 mb-4">This address is not registered in the Clawsight protocol.</p>
        <a href="/agents" class="text-xs text-signal-teal hover:text-signal-teal-bright transition-colors">
          &larr; Back to Agent Registry
        </a>
      </div>
    </div>
  {/if}
</div>
