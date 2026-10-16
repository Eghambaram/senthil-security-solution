import type { NextConfig } from "next";
import { clients } from "./content/clients";
import { visible } from "./lib/facts";

/**
 * 301 redirects from the legacy PHP site (CLAUDE.md §11). The old "The
 * Team" page maps to the About page's leadership section; the old
 * "Clients" page maps to /about#clients once any client logo is cleared
 * for this build, otherwise to /industries.
 */
const LEGACY_REDIRECTS: Record<string, string> = {
  "/index.php": "/",
  "/aboutus.php": "/about",
  "/company.php": "/about#leadership",
  "/service.php": "/services",
  "/projects.php": visible(clients).length > 0 ? "/about#clients" : "/industries",
  "/contact_us.php": "/contact",
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  async redirects() {
    return Object.entries(LEGACY_REDIRECTS).map(([source, destination]) => ({
      source,
      destination,
      statusCode: 301,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
