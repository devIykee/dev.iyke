import AppImage from "./AppImage";

/**
 * A project screenshot slot. When a real URL exists it renders the image (via
 * AppImage — fade-in, lazy, compressed) in a strict 4px-radius rectangle
 * (DESIGN.md "Project Screenshots"). Otherwise it shows a flat-fill placeholder
 * with a small centered label — never a generated illustration.
 */
export default function ScreenshotFrame({
  src,
  label,
  alt,
  className = "",
  labelClassName = "",
}: {
  src?: string | null;
  label: string;
  /** Accessible description used when a real image is present. */
  alt?: string;
  className?: string;
  labelClassName?: string;
}) {
  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden ${className}`}
    >
      {src ? (
        <AppImage
          src={src}
          alt={alt ?? label}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      ) : (
        <span className={`z-10 text-xs uppercase ${labelClassName}`} aria-hidden="true">
          {label}
        </span>
      )}
    </div>
  );
}
