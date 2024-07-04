<script lang="ts">
  import { MaxItems } from '$lib/client/constants'
  import type { FetchPOAPEventsData } from '$lib/client/poap'
  import type { ENSRecords } from '$lib/types/ens'
  import type { POAPEventMetadata, POAPToken } from '$lib/types/poap'
  import { collectItems } from '$lib/utils/items'
  import { Token } from '../Token'

  export let eventData: FetchPOAPEventsData
  export let metadata: Record<number, POAPEventMetadata> = {}
  export let ens: Record<string, ENSRecords> = {}
  export let max = MaxItems

  const set = new Set<string>()

  let tokens: POAPToken[] = []

  $: tokens = collectItems(
    set,
    max,
    tokens,
    eventData.events.flatMap(({ tokens }) => tokens),
    ({ id }) => id,
  ).sort((a, b) => Number(b.created) - Number(a.created))
</script>

<div class="grid grid-cols-1 auto-rows-min gap-2 py-2 w-full">
  {#each tokens as token (token.id)}
    <Token
      {token}
      metadata={(eventData.metadata || metadata)[Number(token.event.id)]}
      ens={(eventData.ens || ens)[token.owner.id]}
    />
  {/each}
</div>
