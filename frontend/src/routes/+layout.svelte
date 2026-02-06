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
  <meta name="description" content="On-chain reputation scoring and USDC ad marketplace for AI agents on Base Sepolia." />
</svelte:head>

<div class="relative flex min-h-screen flex-col bg-abyss-950 isolate">
  <Header />
  <main class="relative z-10 flex-1">
    {@render children()}
  </main>
  <Footer />
</div>
