# Fast Image

For now, you can do `yarn build` and `npx yalc publish` to publish this package to a mock local registry and then install it with `npx yalc link @glints/fast-image`. For development, run `yarn build` and `npx yalc push` to push the new version to all places where the package is linked.

## Usage

```
<ThumborImage
  serverURL="https://images-dev.glints.com"
  src="https://glints-dashboard-dev.s3.amazonaws.com/images/landing/one-stop.png"
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
