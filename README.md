# Visual POAP

This is a simple demo for visualizing POAP mints live using a [Goldsky Subgraphs](https://goldsky.com/products/subgraphs) as the data source. This demo is using the following tools:

- [@download/blockies](https://github.com/download13/blockies#readme) to render the blocky avatars (when an ens avatar is not available)
- [napi-rs/canvas](https://github.com/Brooooooklyn/canvas#readme) to render the blocky/ens avatars on a serverside canvas
- [@resvg/resvg-js](https://github.com/yisibl/resvg-js#readme) to support transforming the satori content into PNG content
- [@urql/svelte](https://formidable.com/open-source/urql/docs/) to fetch the data from the subgraph GraphQL query endpoint
- [date-fns](https://github.com/date-fns/date-fns#readme) to format dates
- [frames.js](https://github.com/framesjs/frames.js/tree/main#readme) to render farcaster frames in the head
- [satori](https://github.com/vercel/satori#readme) to render dynamically generated opengraph images
- [viem](https://viem.sh) to support fetching blockchain metadata (ens)

## The demo

This demo will live feed all POAP mints, but we can also focus on a specific event (`/event/ID`), account (`/account/ADDRESS`), or token id (`/token/ID`). Events also support multi-select (comma separated) so that you can watch the live feed of all targeted events at once (e.g., `/event/ID1,ID2,ID3`). Each POAP token card has a number of links to internal routes and various external sources.

## Opengraph support

When posting a link to social media (use the _share_ icon in the header for cache busting urls), a generated opengraph image will be used to represent the link. This image is generated using the satori tooling and will be a visual representation of the the most recently minted token on that page.

### Farcaster frames

When posting to farcaster, the opengraph image will be a [farcaster frame](https://docs.farcaster.xyz/reference/frames/spec). The initial image is a static image as per the spec, with actions to load dynamic content (e.g., `Refresh latest`). Each time an action is pressed a new image is generated which could represent a whole new POAP token that was minted.
