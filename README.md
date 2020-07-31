# Fast Image

For now, you can do `yarn build` and `npx yalc publish` to publish this package to a mock local registry and then install it with `npx yalc link @glints/fast-image`. For development, run `yarn build` and `npx yalc push` to push the new version to all places where the package is linked.

## Releasing New Versions

Just follow the usual npm publish workflow:

```
git commit // commit your changes
npm version patch // or minor or major
npm publish
git push --all // push your changes and tags to remote
```

## Usage

### FastImage

```
import { FastImage } from '@glints/fast-image';

// ...

<FastImage
  src="https://glints-dashboard.s3.amazonaws.com/glints.png"
  thumborServerURL="https://images.glints.com" // Optional if using ThumborContext
  thumborOptions={{
    filters: [{ name: 'noise', args: [40] }],
  }}
  lazy={true}
  imgProps={{
    sizes: '100px',
    className: 'my-fast-image',
  }}
/>
```

The `imgProps.sizes` param will set the width of the image. If `lazy` is `true`, loading of the image will be deferred until the viewport reaches the position of the image in the page.

### ThumborContext

Add a `ThumborProvider` somewhere above your `FastImage`s to avoid having to pass `thumborServerURL` every time. Example:

```
import { ThumborProvider, FastImage } from '@glints/fast-image';
import config from './config';

// ...

<ThumborProvider thumborServerURL={config.THUMBOR_BASE}>
  <...>
    <FastImage src="https://glints-dashboard.s3.amazonaws.com/glints.png" />
  </...>
</ThumborProvider>
```

### LazyImage

A tiny wrapper to add lazysizes lazy loading to an `<img>`. Used by `FastImage` under the hood if `lazy=true` but might be handy if you don't want the Thumbor functionalities.

```
import { LazyImage } from '@glints/fast-image';

// ...

<LazyImage src={src} srcSet={srcSet} {...otherProps} />
```

### getThumborImageURL

In case you need the thumbor URL directly. A bt inconvenient because you have to pass the thumborServerURL yourself. You may be able to get it from the ThumborContext though, if you have set it up, like so:

```
import React from 'react';
import { ThumborContext, getThumborImageURL } from '@glints/fast-image';

const MyComponent = () => {
  const thumborServerURL = React.useContext(ThumborContext);
  return <img src={getThumborImageURL(
    thumborServerURL,
    'https://glints-dashboard.s3.amazonaws.com/glints.png',
    { size: { height: 128}}}
  />;
}
```

The available options are `hmac`, `size`, `trim`, `trimSource`, `crop`, `fitIn`, `horizontalAlign`, `verticalAlign`, `smartCrop` and `filters`. See https://thumbor.readthedocs.io/en/latest/usage.html for their documentation.

### Lazy CSS `background-image`

Unfortunately there's no handy component for background images. But what you can do is utilize the `addClasses` feature from `lazysizes` (which is a dependency of this project anyway):

```
window.lazySizesConfig = {
  // Add classes like 'lazyloaded' to lazyload elements. That allows us to toggle
  // background-images in styled components when lazysizes determines that it
  // should load.
  addClasses: true,
};

// lazysizes is not exactly react friendly. It relies on global side effects to
// do it's thing. Importing it here will run those side effects (i.e. registering
// its event listeners and whatnot).
import 'lazysizes';

import styled from "styled-components';

const LazyBackgroundImage = styled.div`
  background-color: gray;
  &.lazyloaded {
    background-image: url('https://glints-dashboard.s3.amazonaws.com/glints.png');
  }
`;

// With getThumborImageURL
const LazyBackgroundThumborImage = styled.div`
  background-color: gray;
  &.lazyloaded {
    background-image: url('${getThumborImageURL(
      'https://images.glints.com',
      'https://glints-dashboard.s3.amazonaws.com/glints.png'
      { size: { height: 128}}}
    )}');
  }
`;
```

This will lazy-load the image and show a grey solid color until the lazy-loaded image is ready.
