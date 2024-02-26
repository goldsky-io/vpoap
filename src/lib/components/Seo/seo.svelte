<script lang="ts">
  import { getFrameHtmlHead, type Frame } from 'frames.js'
  import type { POAPEventMetadata } from '$lib/types/poap'
  import type { SeoContext } from './types'

  const baseUrl = import.meta.env.DEV ? 'http://localhost:5173' : 'https://vpoap.vercel.app'
  const title = 'Visual POAP'
  const description = 'Watch POAP mints live!'

  export let route: string
  export let metadata: POAPEventMetadata | POAPEventMetadata[] | undefined = undefined
  export let context: SeoContext = {}
  export let frame: Partial<Frame> = {}

  $: ({ ids, ogImage, seoTitle, seoDescription } = hydrate(metadata))
  $: seoUrl = url(ids, context)

  function frameHtml(frame: Partial<Frame>, ogImage: string, route: string) {
    const action = routeAction()
    const buttons: Frame['buttons'] = frame.buttons || [
      { label: `🔄 Refresh ${action}`, action: 'post' },
    ]
    // we don't include tokenId in the frame context because we don't want to
    // refresh the same token over and over
    const { tokenId, ...state } = context

    // token pages are mostly static, so we can use the dynamic image
    // everything else uses our placeholder static image and will rely on the refresh button
    const image = imageUrl(true)

    return getFrameHtmlHead({
      version: 'vNext',
      postUrl: `${baseUrl}/frame?${new URLSearchParams({ action, context: JSON.stringify(state) }).toString()}`,
      image,
      ogImage,
      buttons,
      ...frame,
    })

    function routeAction() {
      if (route === '/') return 'latest POAP'
      if (route === '/token') return 'POAP'
      if (route === '/account') return 'account POAPs'
      if (route === '/event') return 'event POAPs'
      return 'latest'
    }
  }

  function url(ids: string, context: SeoContext) {
    if (!ids && context.tokenId) return `${baseUrl}/token/${context.tokenId}`

    return `${baseUrl}${route}${ids}`
  }

  function hydrate(metadata?: POAPEventMetadata | POAPEventMetadata[]) {
    const ogImage = imageUrl()

    if (!metadata) {
      return {
        ids: '',
        ogImage,
        seoTitle: title,
        seoDescription: description,
      }
    }

    const metdataArray = Array.isArray(metadata) ? metadata : [metadata]

    return {
      ids: metdataArray.map((m) => m.id).join(','),
      ogImage,
      seoTitle: truncateText(composeTitle(metdataArray), 60),
      seoDescription: truncateText(composeDescription(metdataArray), 155),
    }

    function composeTitle(metadata: POAPEventMetadata[] | undefined) {
      if (!metadata || metadata.length === 0) return title
      if (metadata.length === 1) {
        return `${title} - #${metadata[0].id} ${metadata[0].name}`
      }

      return `${title} - ${metadata.map((m) => `#${m.id}`).join(', ')}`
    }

    function composeDescription(metadata: POAPEventMetadata[] | undefined) {
      if (!metadata || metadata.length === 0) return description
      if (metadata.length === 1) {
        return metadata[0].description || description
      }

      return `${metadata.length} events: ${metadata.map((m) => `#${m.id} ${m.name}`).join(', ')}`
    }

    function truncateText(text: string, length: number) {
      return text.length > length ? `${text.slice(0, length - 1)}…` : text
    }
  }

  function imageUrl(_static = false) {
    const at = new Date().getTime()
    const params = new URLSearchParams({
      at: at.toString(),
    })
    if (_static) {
      params.set('static', 'true')
    }
    const search = params.toString()

    if (context.tokenId) return `${baseUrl}/og/token/${context.tokenId}?${search}`
    if (context.eventIds) return `${baseUrl}/og/event/${context.eventIds.join(',')}?${search}`
    if (context.account) return `${baseUrl}/og/account/${context.account}?${search}`

    return `${baseUrl}/images/twitter-card.png`
  }
</script>

<svelte:head>
  <title>{seoTitle}</title>
  <meta name="description" content={seoDescription} />
  <meta property="og:title" content={seoTitle} />
  <meta property="og:description" content={seoDescription} />
  <meta property="og:url" content={seoUrl} />
  <meta name="twitter:title" content={seoTitle} />
  <meta name="twitter:description" content={seoDescription} />
  <meta name="twitter:url" content={seoUrl} />
  <meta name="twitter:image" content={ogImage} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html frameHtml(frame, ogImage, route)}
</svelte:head>
