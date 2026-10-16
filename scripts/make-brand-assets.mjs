// Builds the static brand assets from the legacy crest and the hero photo:
//   public/og-image.jpg  1200×630 social-share image (referenced in lib/seo.ts)
//   app/icon.png         96×96 favicon (was the 46 KB 200 px crest)
// Run: node scripts/make-brand-assets.mjs. Static files (not next/og) keep the Cloudflare Worker small.
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", { paths: [require.resolve("next")] }));

const W = 1200, H = 630, SPLIT = 640;
const photo = await sharp("public/images/site/hero-gate.webp")
  .resize({ width: W - SPLIT, height: H, fit: "cover", position: "right" })
  .toBuffer();
const logo = await sharp("public/brand/logo-legacy.png").resize({ height: 96 }).toBuffer();

const text = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${SPLIT}" height="${H}" fill="#0B1C32"/>
  <rect x="${SPLIT}" width="6" height="${H}" fill="#D6A33C"/>
  <g font-family="Segoe UI, Arial, sans-serif">
    <text x="64" y="236" fill="#FFFFFF" font-size="34" font-weight="800" letter-spacing="1">SENTHIL</text>
    <text x="64" y="268" fill="#D6A33C" font-size="18" font-weight="600" letter-spacing="4">SECURITY SOLUTIONS</text>
    <text x="64" y="356" fill="#FFFFFF" font-size="46" font-weight="800">Protection that</text>
    <text x="64" y="412" fill="#FFFFFF" font-size="46" font-weight="800">earns <tspan fill="#F2C76A">your trust.</tspan></text>
    <text x="64" y="476" fill="#FFFFFF" fill-opacity="0.78" font-size="22">Security services in Chennai since 2012</text>
    <rect x="64" y="530" width="32" height="3" fill="#D6A33C"/>
    <text x="110" y="539" fill="#FFFFFF" fill-opacity="0.78" font-size="20">Tambaram · +91 44 4380 6837</text>
  </g>
</svg>`;

await sharp({ create: { width: W, height: H, channels: 3, background: "#0B1C32" } })
  .composite([
    { input: photo, left: SPLIT, top: 0 },
    { input: Buffer.from(text), left: 0, top: 0 },
    { input: logo, left: 64, top: 84 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile("public/og-image.jpg");

console.log("public/og-image.jpg written");

await sharp("public/brand/logo-legacy.png")
  .resize({ width: 96, height: 96, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ palette: true, quality: 90, compressionLevel: 9 })
  .toFile("app/icon.png");
console.log("app/icon.png written");
