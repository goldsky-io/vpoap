<script lang="ts">
  import type { POAPEventMetadata } from '$lib/types/poap'

  const baseUrl = 'https://vpoap.vercel.app'
  const title = 'Visual POAP'
  const description = 'Watch POAP mints live!'

  export let metadata: POAPEventMetadata | undefined = undefined

  $: seoTitle = truncateText(metadata ? `${title} - #${metadata.id} ${metadata.name}` : title, 60)
  $: seoDescription = truncateText(metadata?.description || description, 155)

  function truncateText(text: string, length: number) {
    return text.length > length ? `${text.slice(0, length - 1)}…` : text
  }
</script>

<svelte:head>
  <title>{seoTitle}</title>
  <meta name="description" content={seoDescription} />
  <meta property="og:url" content={`${baseUrl}/${metadata?.id || ''}`} />
  <meta property="og:title" content={seoTitle} />
  <meta property="og:description" content={seoDescription} />
  <meta name="twitter:title" content={seoTitle} />
  <meta name="twitter:description" content={seoDescription} />
</svelte:head>
