"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";

type Props = {
  lat: number;
  lng: number;
  title: string;
};

/**
 * Click-to-load Google Map: no third-party request until the visitor asks
 * for it (performance and privacy, PROMPT.md §7).
 */
export function MapEmbed({ lat, lng, title }: Props) {
  const [loaded, setLoaded] = useState(false);
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-surface sm:aspect-[16/10]">
      {loaded ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 size-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_40%,rgb(214_163_60/0.12),transparent_60%)] p-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-navy-900 text-gold-500">
            <MapPin aria-hidden="true" strokeWidth={1.5} className="size-6" />
          </span>
          <p className="max-w-xs text-sm text-ink-muted">
            The map loads from Google Maps. Google may set cookies once it is shown.
          </p>
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="inline-flex h-11 items-center rounded-md border border-navy-900 px-5 text-sm font-semibold text-navy-900 hover:bg-navy-900 hover:text-white"
          >
            Show map
          </button>
        </div>
      )}
    </div>
  );
}
