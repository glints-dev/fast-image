import React from "react";
import { LazyImage } from "./LazyImage";

export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface ThumborOptions {
  hmac?: string;
  size: Size;
  trim?: boolean;
  trimSource?: "bottom-right" | "top-left";
  crop?: {
    topLeft: Point;
    bottomRight: Point;
  };
  fitIn?: boolean;
  horizontalAlign?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  smartCrop?: boolean;
  filters?: {
    name: string;
    args: (string | number)[];
  }[];
}

// Construct the thumbor URL parts.
// Reference: http://thumbor.readthedocs.io/en/latest/usage.html
function getThumborImageURL(
  serverURL: string,
  src: string,
  options: ThumborOptions
) {
  const pathParts = [];

  if (options.hmac) {
    pathParts.push(options.hmac);
  } else {
    pathParts.push("unsafe");
  }

  if (options.trim) {
    let trimPart = "trim";
    if (options.trimSource) {
      trimPart += `:${options.trimSource}`;
    }
    pathParts.push(trimPart);
  }

  if (options.crop) {
    const cropPart =
      `${options.crop.topLeft.x}x${options.crop.topLeft.y}:` +
      `${options.crop.bottomRight.x}x${options.crop.bottomRight.y}`;
    pathParts.push(cropPart);
  }

  if (options.fitIn) {
    pathParts.push("fit-in");
  }

  if (options.size) {
    const width = options.size.width || 0;
    const height = options.size.height || 0;
    pathParts.push(`${width}x${height}`);
  }

  if (options.horizontalAlign) {
    pathParts.push(options.horizontalAlign);
  }

  if (options.verticalAlign) {
    pathParts.push(options.verticalAlign);
  }

  if (options.smartCrop) {
    pathParts.push("smart");
  }

  if (options.filters && options.filters.length > 0) {
    const filterPart = options.filters.map(
      (filter: { args: any; name: string }) => {
        const argsPart =
          filter.args && filter.args.length > 0 ? filter.args.join(",") : "";
        return `${filter.name}(${argsPart})`;
      }
    );
    pathParts.push(`filters:${filterPart.join(":")}`);
  }

  const upstreamURL = new URL(src);

  return `${serverURL}/${pathParts.join("/")}/${upstreamURL.hostname}${
    upstreamURL.pathname
  }`;
}

export interface ThumborImageProps {
  thumborOptions: ThumborOptions;
  serverURL: string; // The URL of the Thumbor service
  src: string; // The URL of the image to process
  breakpoints?: number[];
  imgProps: object; // Additional props to be passed to the final <img>
  lazy?: boolean;
}

export const ThumborImage = (props: ThumborImageProps) => {
  const breakpoints = props.breakpoints || [160, 360, 480, 720, 960, 1024];

  // Construct Thumbor URLs for different breakpoints and merge them into a srcSet.
  const srcSet = breakpoints
    .map((breakpoint) => {
      const url = getThumborImageURL(props.serverURL, props.src, {
        ...props.thumborOptions,
        size: {
          height: 0,
          width: breakpoint,
        },
      });
      return `${url} ${breakpoint}w`;
    })
    .join(",");

  const src = getThumborImageURL(props.serverURL, props.src, {
    ...props.thumborOptions,
    size: {
      height: 0,
      width: breakpoints[breakpoints.length - 1],
    },
  });

  if (props.lazy) {
    return <LazyImage src={src} srcSet={srcSet} {...props.imgProps} />;
  } else {
    return <img src={src} srcSet={srcSet} {...props.imgProps} />;
  }
};
