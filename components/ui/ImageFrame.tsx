import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { images, type ImageKey } from "@/content/images";
import { cn } from "@/lib/cn";
import { SHOW_PENDING } from "@/lib/facts";

type Props = {
  image: ImageKey;
  /** Required `sizes` for next/image (CLAUDE.md §9). */
  sizes: string;
  priority?: boolean;
  /** next/image quality; must be listed in images.qualities (next.config.ts). */
  quality?: 75 | 85;
  className?: string;
  imgClassName?: string;
};

/** Whether a slot has an approved photo; otherwise it renders a placeholder frame. */
export function hasPhoto(key: ImageKey): boolean {
  const entry = images[key];
  return entry.src !== null && entry.approved;
}

/**
 * Fills its (positioned, sized) parent with the approved photo, or with a
 * neutral navy frame until one exists. In development the frame carries a
 * "Photo pending" label with the shot brief (also in client review mode);
 * on the live site it is a plain, decorative panel.
 */
export function ImageFrame({ image, sizes, priority = false, quality, className, imgClassName }: Props) {
  const entry = images[image];

  if (entry.src !== null && entry.approved) {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)}>
        <Image
          src={entry.src}
          alt={entry.alt}
          fill
          sizes={sizes}
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          quality={quality}
          className={cn("object-cover", imgClassName)}
          style={entry.position ? { objectPosition: entry.position } : undefined}
        />
      </div>
    );
  }

  const showLabel = SHOW_PENDING;

  return (
    <div
      aria-hidden="true"
      data-image-placeholder={image}
      className={cn(
        "absolute inset-0 overflow-hidden bg-gradient-to-br from-navy-800 via-navy-900 to-graphite",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgb(255_255_255/0.035)_0_1px,transparent_1px_14px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgb(214_163_60/0.14),transparent_60%)]" />
      {showLabel ? (
        <div className="absolute inset-x-3 bottom-3 flex items-start gap-2 rounded-sm bg-yellow-300/95 px-2.5 py-1.5 text-[11px] font-semibold leading-snug text-black">
          <ImageIcon strokeWidth={1.75} className="mt-px size-3.5 shrink-0" />
          <span>
            Photo pending: {entry.brief}
          </span>
        </div>
      ) : null}
    </div>
  );
}
