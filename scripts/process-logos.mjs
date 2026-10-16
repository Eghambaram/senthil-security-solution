// Normalises the client logos supplied by the project owner into web-ready WebP files.
// Run: node scripts/process-logos.mjs
// Sources (not published) live in assets/source-images/clients/; outputs go to public/images/clients/.
// Each logo is flattened onto white, trimmed of surrounding whitespace, padded
// evenly and fitted inside 320×128 px so the grid reads at a consistent size.
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", { paths: [require.resolve("next")] }));

const SRC = "assets/source-images/clients";
const OUT = "public/images/clients";

/** `trim: false` keeps logos whose coloured background is part of the mark; `inset` strips a frame line. */
/** @type {{ src: string; out: string; trim?: boolean; inset?: number }[]} */
const JOBS = [
  { src: "1.png", out: "afflatus.webp" },
  { src: "2.png", out: "gajanan-hospitals.webp" },
  { src: "3.jpg", out: "avalon.webp" },
  { src: "4.jpg", out: "coromandel-engineering.webp" },
  { src: "5.jpg", out: "unidentified-5.webp", trim: false },
  { src: "6.jpg", out: "eskay-cartons.webp" },
  { src: "7.jpg", out: "evolv-clothing.webp" },
  { src: "8.jpg", out: "flowwell-castings.webp" },
  { src: "9.png", out: "hans-ford.webp" },
  { src: "10.png", out: "maansarovar-honda.webp" },
  { src: "11.png", out: "mass-auto-components.webp" },
  { src: "13.jpg", out: "padmash-leathers.webp", trim: false },
  { src: "15.jpg", out: "powerica.webp" },
  { src: "17.png", out: "quintessence.webp" },
  { src: "19.jpg", out: "super-auto-forge.webp", inset: 3 },
  { src: "21.jpg", out: "tamilnad-mercantile-bank.webp" },
];

await mkdir(OUT, { recursive: true });

for (const job of JOBS) {
  let buf = await sharp(path.join(SRC, job.src)).flatten({ background: "#ffffff" }).png().toBuffer();
  if (job.inset) {
    const m = await sharp(buf).metadata();
    buf = await sharp(buf)
      .extract({ left: job.inset, top: job.inset, width: m.width - 2 * job.inset, height: m.height - 2 * job.inset })
      .toBuffer();
  }
  if (job.trim !== false) buf = await sharp(buf).trim({ background: "#ffffff", threshold: 24 }).toBuffer();
  const info = await sharp(buf)
    .resize({ width: 320, height: 128, fit: "inside", withoutEnlargement: true, kernel: "lanczos3" })
    .webp({ quality: 90, effort: 6 })
    .toFile(path.join(OUT, job.out));
  console.log(`${job.out.padEnd(32)} ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
}
