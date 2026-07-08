import Image from "next/image";

/**
 * A project screenshot slot. When a real URL exists it renders the image with a
 * strict 4px-radius rectangle (DESIGN.md "Project Screenshots"). Otherwise it
 * shows a flat-fill placeholder with a small centered label — never a generated
 * illustration, per the design fidelity rules.
 */
export default function ScreenshotFrame({
  src,
  label,
  className = "",
  labelClassName = "",
}: {
  src?: string | null;
  label: string;
  className?: string;
  labelClassName?: string;
}) {
  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={label}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      ) : (
        <span className={`z-10 text-xs uppercase ${labelClassName}`}>{label}</span>
      )}
    </div>
  );
}
