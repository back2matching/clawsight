import { formatUnits } from 'ethers';

export function formatUsdc(amount: bigint): string {
  return formatUnits(amount, 6);
}

export function formatUsdcDisplay(amount: bigint): string {
  const num = Number(formatUnits(amount, 6));
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export type TierInfo = {
  tier: string;
  label: string;
  className: string;
};

export function getScoreTier(score: number): TierInfo {
  if (score >= 900) return { tier: 'Diamond', label: 'Elite', className: 'diamond' };
  if (score >= 600) return { tier: 'Platinum', label: 'Influencer', className: 'platinum' };
  if (score >= 300) return { tier: 'Gold', label: 'Contributor', className: 'gold' };
  if (score >= 100) return { tier: 'Silver', label: 'Active', className: 'silver' };
  return { tier: 'Bronze', label: 'New', className: 'bronze' };
}

export function getTierColor(className: string): string {
  const colors: Record<string, string> = {
    bronze: '#b87333',
    silver: '#8fa5b8',
    gold: '#e0b040',
    platinum: '#b8d4f0',
    diamond: '#9966ff',
  };
  return colors[className] || '#3d4a68';
}

export function formatTimestamp(timestamp: bigint): string {
  return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function timeAgo(timestamp: bigint): string {
  const seconds = Math.floor(Date.now() / 1000 - Number(timestamp));
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
