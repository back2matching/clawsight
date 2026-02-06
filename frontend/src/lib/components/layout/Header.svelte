<script lang="ts">
  import { page } from '$app/state';
  import WalletConnect from '$lib/components/web3/WalletConnect.svelte';
  import { CHAIN_ID } from '$lib/contracts';

  let mobileOpen = $state(false);

  const navItems = [
    { href: '/', label: 'Home', shortcut: 'H' },
    { href: '/marketplace-v2', label: 'Marketplace', shortcut: 'M' },
    { href: '/sell', label: 'Sell', shortcut: 'S' },
    { href: '/dashboard', label: 'Dashboard', shortcut: 'D' },
    { href: '/agents', label: 'Agents', shortcut: 'A' },
    { href: '/leaderboard', label: 'Leaderboard', shortcut: 'L' },
  ];

  function isActive(href: string): boolean {
    if (href === '/') return page.url.pathname === '/';
    return page.url.pathname.startsWith(href);
  }
</script>

<header class="sticky top-0 z-50 border-b border-abyss-750/60 bg-abyss-950/70 backdrop-blur-xl">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-14 items-center justify-between">
      <!-- Logo + Nav -->
      <div class="flex items-center gap-6">
        <a href="/" class="flex items-center gap-2.5 group">
          <div class="relative flex h-7 w-7 items-center justify-center rounded-md bg-signal-teal/10 border border-signal-teal/20 group-hover:border-signal-teal/40 transition-colors">
            <svg viewBox="0 0 16 16" class="h-3.5 w-3.5 text-signal-teal" fill="currentColor">
              <path d="M8 1L2 4.5v7L8 15l6-3.5v-7L8 1zm0 1.15L12.85 5 8 7.85 3.15 5 8 2.15zM3 5.85l4.5 2.6v5.1L3 10.95v-5.1zm10 0v5.1l-4.5 2.6v-5.1L13 5.85z"/>
            </svg>
          </div>
          <span class="text-sm font-semibold tracking-tight text-abyss-50">Clawsight</span>
        </a>

        <div class="hidden md:flex items-center h-14">
          <div class="flex items-center border-l border-abyss-750/60 pl-6">
            <nav class="flex items-center gap-0.5">
              {#each navItems as { href, label, shortcut }}
                <a
                  {href}
                  class="relative px-3 py-1.5 text-[13px] font-medium rounded-md transition-all duration-200
                    {isActive(href)
                      ? 'text-signal-teal'
                      : 'text-abyss-400 hover:text-abyss-100'}"
                >
                  {label}
                  {#if isActive(href)}
                    <span class="absolute bottom-0 left-3 right-3 h-px bg-signal-teal"></span>
                  {/if}
                </a>
              {/each}
            </nav>
          </div>
        </div>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-3">
        <div class="network-badge hidden sm:inline-flex">
          <span class="live-dot"></span>
          Base Sepolia
        </div>
        <WalletConnect />

        <!-- Mobile menu toggle -->
        <button
          onclick={() => mobileOpen = !mobileOpen}
          class="md:hidden p-2 rounded-lg text-abyss-400 hover:text-abyss-200 hover:bg-abyss-800 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
            {#if mobileOpen}
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
            {:else}
              <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
            {/if}
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile nav -->
  {#if mobileOpen}
    <div class="md:hidden border-t border-abyss-750/60 bg-abyss-900/95 backdrop-blur-xl">
      <nav class="flex flex-col p-3 gap-1">
        {#each navItems as { href, label }}
          <a
            {href}
            onclick={() => mobileOpen = false}
            class="px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
              {isActive(href)
                ? 'text-signal-teal bg-signal-teal/5'
                : 'text-abyss-300 hover:text-abyss-100 hover:bg-abyss-800'}"
          >
            {label}
          </a>
        {/each}
      </nav>
    </div>
  {/if}
</header>
