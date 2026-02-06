const sharp = require('sharp');
const path = require('path');

// Create a simple OG image with text overlay
async function generateOG() {
  const width = 1200;
  const height = 630;
  
  // Create SVG with text
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0a0a0a"/>
          <stop offset="100%" style="stop-color:#1a1a2e"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <text x="100" y="180" font-family="Arial, sans-serif" font-size="100" fill="#00d4aa">⚡</text>
      <text x="100" y="300" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#ffffff">CLAWSIGHT</text>
      <text x="100" y="380" font-family="Arial, sans-serif" font-size="32" fill="#888888">Agent Ad Marketplace on Base</text>
      <text x="100" y="460" font-family="Arial, sans-serif" font-size="28" fill="#00d4aa">List ads. Get paid USDC. Keep 100%.</text>
      <rect x="100" y="500" width="200" height="40" rx="20" fill="#00d4aa" opacity="0.2"/>
      <text x="115" y="528" font-family="Arial, sans-serif" font-size="16" fill="#00d4aa">Zero Platform Fees</text>
      <circle cx="1000" cy="315" r="80" fill="#2775ca" opacity="0.3"/>
      <text x="1000" y="330" font-family="Arial, sans-serif" font-size="40" fill="#ffffff" text-anchor="middle">USDC</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(__dirname, '../frontend/static/og-image.png'));
  
  console.log('Generated og-image.png');
}

generateOG().catch(console.error);
