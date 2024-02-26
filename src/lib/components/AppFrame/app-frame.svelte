<script lang="ts">
  import { page } from '$app/stores'
  import type { POAPEventMetadata } from '$lib/types/poap'
  import { Seo, type SeoContext } from '../Seo'

  export let route = '/'
  export let metadata: POAPEventMetadata | POAPEventMetadata[] | undefined = undefined
  export let context: SeoContext | undefined = undefined

  $: metadataArray = hydrate(metadata)

  function hydrate(metadata?: POAPEventMetadata | POAPEventMetadata[]) {
    if (!metadata) return

    return Array.isArray(metadata) ? metadata : [metadata]
  }

  function shareData(basic = false): ShareData {
    const url = new URL($page.url.href)
    url.searchParams.set('at', new Date().getTime().toString())
    const data: ShareData = {
      url: url.href,
    }

    if (basic) return data

    data.title = truncateText(composeTitle(metadataArray), 60)

    return data

    function composeTitle(metadata: POAPEventMetadata[] | undefined) {
      const title = 'Visual POAP'
      if (!metadata || metadata.length === 0) return title
      if (metadata.length === 1) {
        return `${title} - #${metadata[0].id} ${metadata[0].name}`
      }

      return `${title} - ${metadata.map((m) => `#${m.id}`).join(', ')}`
    }

    function truncateText(text: string, length: number) {
      return text.length > length ? `${text.slice(0, length - 1)}…` : text
    }
  }

  async function handleShare(event: MouseEvent) {
    if (!navigator.share) return

    const data = shareData()
    if (!navigator.canShare(data)) return

    event.preventDefault()
    await navigator.share(data)
  }
</script>

<Seo {route} {metadata} {context} />

<header class="relative bg-neutral-700 border-b border-black/25 text-neutral-200">
  <div class="flex flex-nowrap items-center justify-center gap-1 px-2 py-0.5">
    <span>Watch</span>
    {#if metadataArray && metadataArray.length > 0}
      <span class="truncate">
        {#if metadataArray.length === 1}
          <a
            class="text-indigo-300 hover:brightness-110 font-semibold transition-all"
            href={`https://poap.xyz/event/${metadataArray[0].id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {metadataArray[0].name}
          </a>
        {:else}
          {#each metadataArray as m, i (m.id)}
            <a
              class="text-indigo-300 hover:brightness-110 font-semibold transition-all"
              href={`https://poap.xyz/event/${m.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              #{m.id}
            </a>
            {#if i !== metadataArray.length - 1}
              <span class="-ml-1">, </span>
            {/if}
            {#if i === metadataArray.length - 2}
              <span>and </span>
            {/if}
          {/each}
        {/if}
      </span>
    {:else}
      <a
        class="text-indigo-300 hover:brightness-110 font-semibold transition-all"
        href="https://poap.xyz"
        target="_blank"
        rel="noopener noreferrer"
      >
        POAP
      </a>
    {/if}
    <span class="whitespace-nowrap">mints live!</span>
    <a class="h-4 w-4" href={shareData(true).url} on:click={handleShare}>
      <svg class="text-current" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M376 176H272v145a16 16 0 01-32 0V176H136a56.06 56.06 0 00-56 56v192a56.06 56.06 0 0056 56h240a56.06 56.06 0 0056-56V232a56.06 56.06 0 00-56-56zM272 86.63l52.69 52.68a16 16 0 0022.62-22.62l-80-80a16 16 0 00-22.62 0l-80 80a16 16 0 0022.62 22.62L240 86.63V176h32z"
          fill="currentColor"
        />
      </svg>
    </a>
  </div>
</header>
<main class="flex-1 flex relative overflow-y-auto bg-neutral-300">
  <div class="container mx-auto px-2">
    <slot />
  </div>
</main>
<footer class="relative py-1 bg-neutral-700 border-t border-black/25 text-neutral-200">
  <div class="text-center">
    Powered by <a
      class="text-[#ffbf60] hover:brightness-110 font-semibold transition-all"
      href="https://goldsky.com/products/subgraphs"
      target="_blank"
      rel="noopener noreferrer"
    >
      Goldsky
    </a> subgraphs
  </div>
</footer>
