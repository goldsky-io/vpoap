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
      const title = 'POAP live feed'
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
  <div class="flex items-center justify-center gap-1">
    Powered by <a
      class="text-[#ffbf60] hover:brightness-110 font-semibold transition-all"
      href="https://goldsky.com/products/subgraphs"
      target="_blank"
      rel="noopener noreferrer"
    >
      Goldsky
    </a>
    subgraphs
    <a
      class="leading-none text-neutral-200 hover:text-[#ffbf60] transition-all"
      href="https://github.com/goldsky-io/vpoap"
      target="_blank"
      rel="noopener noreferrer"
      ><svg
        class="inline-block"
        width="20"
        height="20"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 003.8.4c8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 01-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0025.6-6c2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 015-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 01112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 015 .5c12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 004-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z"
          fill="currentColor"
        /></svg
      ></a
    >
  </div>
</footer>
