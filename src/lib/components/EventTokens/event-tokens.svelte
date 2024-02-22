<script lang="ts">
  import { MaxItems } from '$lib/client/constants'
  import type { POAPEventMetadata, POAPEventWithTokens, POAPToken } from '$lib/types/poap'
  import { collectItems } from '$lib/utils/items'
  import { Token } from '../Token'

  export let events: POAPEventWithTokens[]
  export let metadata: Record<string, POAPEventMetadata>
  export let max = MaxItems

  const set = new Set<string>()

  let tokens: POAPToken[] = []

  $: eventMap = Object.fromEntries(events.map((event) => [event.id, event]))
  $: tokens = collectItems(
    set,
    max,
    tokens,
    events.flatMap(({ tokens }) => tokens),
    ({ id }) => id,
  ).sort((a, b) => Number(b.created) - Number(a.created))
</script>

<div class="grid grid-cols-1 auto-rows-min gap-2 py-2 w-full">
  {#each tokens as token (token.id)}
    <Token {token} event={eventMap[token.event.id]} metadata={metadata[token.event.id]} />
  {/each}
</div>
