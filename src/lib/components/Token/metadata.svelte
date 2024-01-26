<script lang="ts">
  import { formatISO } from 'date-fns'
  import type { POAPEventMetadata } from '$lib/types/poap'

  export let metadata: POAPEventMetadata

  $: tags = [
    `#${metadata.id}`,
    formatISO(metadata.start_date, { representation: 'date' }),
    [metadata.city, metadata.country].filter(Boolean).join(', '),
  ].filter(Boolean)
</script>

<div class="flex flex-col sm:flex-row sm:items-center justify-between">
  <a
    class="text-indigo-700 hover:brightness-110 hover:underline transition-all truncate"
    href={metadata.event_url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <h2 class="text-xl font-semibold truncate">{metadata.name}</h2>
  </a>
  <div class="flex flex-wrap justify-end gap-1">
    {#each tags as tag}
      <p
        class="bg-neutral-700 text-neutral-200 rounded-sm border border-neutral-500/50 p-0.5 text-xs font-mono"
      >
        {tag}
      </p>
    {/each}
  </div>
</div>
<div class="flex-1 max-h-32 overflow-y-auto">
  <p>{metadata.description}</p>
</div>
