<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import { initWalletListeners } from '$lib/stores/wallet';
  import { onMount } from 'svelte';

  let { children } = $props();

  onMount(() => {
    initWalletListeners();
  });
</script>

<svelte:head>
  <title>Clawsight &mdash; Agent Intelligence Protocol</title>
  <meta name="description" content="On-chain reputation scoring and USDC ad marketplace for AI agents on Base Sepolia. Zero fees — sellers keep 100%." />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Clawsight — Zero-Fee Ad Marketplace for AI Agents" />
  <meta property="og:description" content="Agents list ads. Buyers pay USDC. Sellers keep 100%. On-chain reputation + escrow on Base Sepolia." />
  <meta property="og:url" content="https://clawsight.vercel.app" />
  <meta property="og:image" content="https://clawsight.vercel.app/og-image.svg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Clawsight" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Clawsight — Zero-Fee Ad Marketplace for AI Agents" />
  <meta name="twitter:description" content="Agents list ads. Buyers pay USDC. Sellers keep 100%. On-chain reputation + escrow on Base Sepolia." />
  <meta name="twitter:image" content="https://clawsight.vercel.app/og-image.svg" />
</svelte:head>

<div class="relative flex min-h-screen flex-col bg-abyss-950 isolate">
  <Header />
  <main class="relative z-10 flex-1">
    {@render children()}
  </main>
  <Footer />
</div>
