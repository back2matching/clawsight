import { formatUnits } from "viem";

export function formatUsdc(amount: bigint): string {
  return formatUnits(amount, 6);
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getScoreTier(score: number): {
  tier: string;
  label: string;
  color: string;
} {
  if (score >= 900) return { tier: "Diamond", label: "Elite", color: "var(--tier-diamond)" };
  if (score >= 600) return { tier: "Platinum", label: "Influencer", color: "var(--tier-platinum)" };
  if (score >= 300) return { tier: "Gold", label: "Contributor", color: "var(--tier-gold)" };
  if (score >= 100) return { tier: "Silver", label: "Active", color: "var(--tier-silver)" };
  return { tier: "Bronze", label: "New", color: "var(--tier-bronze)" };
}

export function formatTimestamp(timestamp: bigint): string {
  return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
