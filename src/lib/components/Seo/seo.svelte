<script lang="ts">
  import type { POAPEventMetadata } from '$lib/types/poap'
  import type { SeoContext } from './types'

  const baseUrl = 'https://vpoap.vercel.app'
  const title = 'Visual POAP'
  const description = 'Watch POAP mints live!'

  export let route: string
  export let metadata: POAPEventMetadata | POAPEventMetadata[] | undefined = undefined
  export let context: SeoContext | undefined = undefined

  $: ({ ids, image, seoTitle, seoDescription } = hydrate(metadata))

  function hydrate(metadata?: POAPEventMetadata | POAPEventMetadata[]) {
    const image = imageUrl()

    if (!metadata) {
      return {
        ids: '',
        image,
        seoTitle: title,
        seoDescription: description,
      }
    }

    const metdataArray = Array.isArray(metadata) ? metadata : [metadata]

    return {
      ids: metdataArray.map((m) => m.id).join(','),
      image,
      seoTitle: truncateText(composeTitle(metdataArray), 60),
      seoDescription: truncateText(composeDescription(metdataArray), 155),
    }

    function imageUrl() {
      if (context) {
        const at = new Date().getTime()
        if (context.tokenId) return `${baseUrl}/og/token/${context.tokenId}?at=${at}`
        if (context.eventIds) return `${baseUrl}/og/event/${context.eventIds.join(',')}?at=${at}`
        if (context.account) return `${baseUrl}/og/account/${context.account}?at=${at}`
      }

      return `${baseUrl}/images/twitter-card.png`
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
</script>

<svelte:head>
  <title>{seoTitle}</title>
  <meta name="description" content={seoDescription} />
  <meta property="og:url" content={`${baseUrl}${route}${ids}`} />
  <meta property="og:title" content={seoTitle} />
  <meta property="og:description" content={seoDescription} />
  <meta property="og:image" content={image} />
  <meta name="twitter:title" content={seoTitle} />
  <meta name="twitter:description" content={seoDescription} />
  <meta name="twitter:image" content={image} />
</svelte:head>
