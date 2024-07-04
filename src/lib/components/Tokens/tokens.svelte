<script lang="ts">
  import { MaxItems } from '$lib/client/constants'
  import type { FetchPOAPTokensData } from '$lib/client/poap'
  import type { ENSRecords } from '$lib/types/ens'
  import type { POAPEventMetadata, POAPTokenWithEvent } from '$lib/types/poap'
  import { collectItems } from '$lib/utils/items'
  import { Token } from '../Token'

  export let tokenData: FetchPOAPTokensData
  export let metadata: Record<number, POAPEventMetadata> = {}
  export let ens: Record<string, ENSRecords> = {}
  export let max = MaxItems

  const set = new Set<string>()

  let tokens: POAPTokenWithEvent[] = []

  $: tokens = collectItems(set, max, tokens, tokenData.tokens, ({ id }) => id).sort(
    (a, b) => Number(b.created) - Number(a.created),
  )
</script>

<div class="grid grid-cols-1 auto-rows-min gap-2 py-2 w-full">
  {#each tokens as token (token.id)}
    <Token
      {token}
      metadata={(tokenData.metadata || metadata)[Number(token.event.id)]}
      ens={(tokenData.ens || ens)[token.owner.id]}
    />
  {/each}
</div>
