<script lang="ts">
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
