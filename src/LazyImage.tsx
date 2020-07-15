import React from "react";
import "lazysizes";

export interface LazyImageProps {
  src: string;
  srcSet: string;
  sizes?: string;
  className?: string;
  [key: string]: any;
}

export const LazyImage = (props: LazyImageProps) => {
  const safeProps = { ...props };
  delete safeProps.src;
  delete safeProps.srcSet;
  delete safeProps.sizes;
  return (
    <img
      {...safeProps}
      data-sizes={props.sizes || "auto"}
      data-src={props.src}
      data-srcset={props.srcSet}
      className={[props.className, "lazyload"].join(" ")}
    />
  );
};
