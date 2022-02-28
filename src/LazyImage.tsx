import React from "react";
import "lazysizes";

export interface LazyImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  srcSet: string;
  sizes?: string;
  className?: string;
}

export const LazyImage = ({
  sizes,
  src,
  srcSet,
  className,
  ...safeProps
}: LazyImageProps) => {
  return (
    <img
      {...safeProps}
      data-sizes={sizes || "auto"}
      data-src={src}
      data-srcset={srcSet}
      className={[className, "lazyload"].join(" ")}
    />
  );
};
