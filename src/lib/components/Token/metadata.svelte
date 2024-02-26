<script lang="ts">
  import { formatISO } from 'date-fns'
  import type { POAPEventMetadata, POAPToken } from '$lib/types/poap'

  export let token: POAPToken
  export let metadata: POAPEventMetadata

  $: location = [metadata.city, metadata.country].filter(Boolean).join(', ')
</script>

<div class="flex flex-col sm:flex-row items-center justify-between overflow-x-clip">
  {#if metadata.event_url}
    <a
      class="w-full text-indigo-700 hover:brightness-110 hover:underline transition-all truncate"
      href={metadata.event_url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2 class="text-xl text-center sm:text-left font-semibold truncate">{metadata.name}</h2>
    </a>
  {:else}
    <h2 class="text-xl font-semibold truncate">{metadata.name}</h2>
  {/if}
  <div class="flex flex-wrap sm:flex-nowrap justify-center lg:justify-end gap-1 min-w-36">
    <a
      class="bg-neutral-700 text-indigo-300 hover:brightness-110 rounded-sm border border-neutral-500/50 p-0.5 text-xs font-mono text-nowrap"
      href="/event/{metadata.id}"
    >
      #{metadata.id}
    </a>
    <p
      class="bg-neutral-700 text-neutral-200 rounded-sm border border-neutral-500/50 p-0.5 text-xs font-mono text-nowrap"
    >
      {formatISO(Number(token.created) * 1000, { representation: 'date' })}
    </p>
    {#if location}
      {#if metadata.virtual_event}
        <p
          class="bg-neutral-700 text-neutral-200 rounded-sm border border-neutral-500/50 p-0.5 text-xs font-mono text-nowrap"
        >
          <span class="grayscale">🌐</span>
          <span class="-ml-1">{location}</span>
        </p>
      {:else}
        <a
          class="bg-neutral-700 text-indigo-300 hover:brightness-110 rounded-sm border border-neutral-500/50 p-0.5 text-xs font-mono text-nowrap"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="grayscale">🌐</span>
          <span class="-ml-1">{location}</span>
        </a>
      {/if}
    {/if}
  </div>
</div>
<div class="flex-1 lg:max-h-32 overflow-y-auto overflow-x-clip">
  <p class="text-sm sm:text-base">{metadata.description}</p>
</div>
