// Crops and compresses the supplied images into web-ready WebP files.
// Run: node scripts/process-images.mjs
// Sources (not published) live in assets/source-images/; outputs go to public/images/site/.
// Crops remove details that would mislead visitors (see docs/ASSUMPTIONS.md).
import { createRequire } from "node:module";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", { paths: [require.resolve("next")] }));

const SRC = "assets/source-images";
const OUT = "public/images/site";

/** @type {{ src: string; out: string; crop?: { left: number; top: number; width: number; height: number }; width?: number; enlarge?: boolean; quality?: number }[]} */
const JOBS = [
  // The hero is shown cover-cropped at up to ~1400 CSS px wide, so it is enlarged
  // with Lanczos resampling and lightly sharpened, at higher quality.
  { src: "00-Herosection.png", out: "hero-gate.webp", width: 2400, enlarge: true, quality: 86 },
  // Removes the "Chakan Industrial Area – MIDC" sign (Pune) and the AI watermark.
  { src: "01-IndustrialSecurity.jpg", out: "industrial-truck-check.webp", crop: { left: 0, top: 140, width: 1480, height: 753 } },
  { src: "02-CorporateCommercial.jpg", out: "corporate-lobby.webp" },
  // Removes the Maharashtra number plate and the AI watermark.
  { src: "03-ResidentialSecurity.jpg", out: "residential-gate.webp", crop: { left: 0, top: 0, width: 1380, height: 873 } },
  // Removes the US and Texas flags (stock photo taken in the USA).
  { src: "04-EventPersonalSecurity.jpg", out: "event-screening.webp", crop: { left: 0, top: 300, width: 2000, height: 1033 } },
  { src: "05-SecurityTeamBriefingatFacilityEntrance.png", out: "team-briefing.webp" },
  { src: "06-IndustrialSecurityPatrolatModernFacility.png", out: "perimeter-patrol.webp" },
  { src: "07-IndustrialSecurityCheckpointInspection.png", out: "gate-inspection.webp" },
  { src: "08-ITParkSecurityCheckpoint.png", out: "it-park-checkpoint.webp" },
  // Removes the retailer's store sign so it does not imply a client relationship.
  { src: "09-CommercialBuildingsRetail.jpg", out: "retail-entrance.webp", crop: { left: 0, top: 245, width: 1034, height: 475 } },
];

await mkdir(OUT, { recursive: true });

for (const job of JOBS) {
  let img = sharp(path.join(SRC, job.src)).rotate();
  if (job.crop) img = img.extract(job.crop);
  img = img.resize({ width: job.width ?? 1600, withoutEnlargement: !job.enlarge, kernel: "lanczos3" });
  if (job.enlarge) img = img.sharpen({ sigma: 0.7, m1: 0.5, m2: 2 });
  img = img.webp({ quality: job.quality ?? 78, effort: 6, smartSubsample: true });
  const info = await img.toFile(path.join(OUT, job.out));
  const before = (await stat(path.join(SRC, job.src))).size;
  console.log(
    `${job.out.padEnd(28)} ${String(info.width).padStart(4)}x${String(info.height).padEnd(5)} ${Math.round(before / 1024)} KB → ${Math.round(info.size / 1024)} KB`,
  );
}
