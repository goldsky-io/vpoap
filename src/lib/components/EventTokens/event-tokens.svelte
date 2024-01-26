<script lang="ts">
  import type { POAPEventMetadata, POAPEventWithTokens, POAPToken } from '$lib/types/poap'
  import { collectItems } from '$lib/utils/items'
  import { Token } from '../Token'

  export let event: POAPEventWithTokens
  export let metadata: POAPEventMetadata

  const max = 5
  const set = new Set<string>()

  let tokens: POAPToken[] = []

  $: tokens = collectItems(set, max, tokens, event.tokens, ({ id }) => id)
</script>

<div class="grid grid-cols-1 gap-2 py-2 w-full">
  {#each tokens as token}
    <Token {token} {event} {metadata} />
  {/each}
</div>
