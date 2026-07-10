"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image wrapper that fades in once the image finishes loading (no hard
 * pop-in). Keeps all next/image benefits (compression, lazy-loading). Under
 * prefers-reduced-motion the .img-fade transition is disabled, so it just shows.
 */
export default function AppImage({ className = "", onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      className={`img-fade ${loaded ? "img-loaded" : ""} ${className}`}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
    />
  );
}
