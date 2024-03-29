import React, { useContext } from "react";
import { LazyImage } from "./LazyImage";
import { ThumborContext } from "./ThumborContext";

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
export function getThumborImageURL(
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

export interface FastImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  thumborOptions?: ThumborOptions;
  thumborServerURL?: string; // The URL of the Thumbor service
  thumborBreakpoints?: number[];
  src: string; // The URL of the image to process
  lazy?: boolean;
}

export const FastImage = ({
  lazy,
  src: srcFromProps,
  thumborOptions,
  thumborBreakpoints,
  thumborServerURL: thumborServerURLFromProps,
  ...safeProps
}: FastImageProps) => {
  const thumborServerURLFromContext = useContext(ThumborContext);
  const thumborServerURL =
    thumborServerURLFromContext || thumborServerURLFromProps;

  if (!thumborServerURL) {
    throw "thumborServerURL not specified! You must provide a thumborServerURL either as a prop or through an ancestral ThumborProvider.";
  }

  const breakpoints = thumborBreakpoints || [160, 360, 480, 720, 960, 1024];

  // Construct Thumbor URLs for different breakpoints and merge them into a srcSet.
  const srcSet = breakpoints
    .map((breakpoint) => {
      const url = getThumborImageURL(thumborServerURL, srcFromProps, {
        ...thumborOptions,
        size: {
          height: 0,
          width: breakpoint,
        },
      });
      return `${url} ${breakpoint}w`;
    })
    .join(",");

  const src = getThumborImageURL(thumborServerURL, srcFromProps, {
    ...thumborOptions,
    size: {
      height: 0,
      width: breakpoints[breakpoints.length - 1],
    },
  });

  if (lazy) {
    return <LazyImage {...safeProps} src={src} srcSet={srcSet} />;
  } else {
    return <img {...safeProps} src={src} srcSet={srcSet} />;
  }
};
