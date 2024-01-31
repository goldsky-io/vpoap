<script lang="ts">
  import type { POAPEventMetadata } from '$lib/types/poap'

  const baseUrl = 'https://vpoap.vercel.app'
  const title = 'Visual POAP'
  const description = 'Watch POAP mints live!'

  export let metadata: POAPEventMetadata[] | undefined = undefined

  $: ids = metadata?.map((m) => m.id).join(',') || ''
  $: seoTitle = truncateText(composeTitle(metadata), 60)
  $: seoDescription = truncateText(composeDescription(metadata), 155)

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
</script>

<svelte:head>
  <title>{seoTitle}</title>
  <meta name="description" content={seoDescription} />
  <meta property="og:url" content={`${baseUrl}/${ids}`} />
  <meta property="og:title" content={seoTitle} />
  <meta property="og:description" content={seoDescription} />
  <meta name="twitter:title" content={seoTitle} />
  <meta name="twitter:description" content={seoDescription} />
</svelte:head>
