<script lang="ts">
  import { queryPOAPTokens } from '$lib/client/poap'
  import { AppFrame } from '$lib/components/AppFrame'
  import { ErrorMessage } from '$lib/components/ErrorMessage'
  import { Loading } from '$lib/components/Loading'
  import { Token } from '$lib/components/Token'
  import type { POAPTokenWithEvent } from '$lib/types/poap'
  import { collectItems } from '$lib/utils/items'

  const max = 5
  const query = queryPOAPTokens(max).poll()
  const set = new Set<string>()

  let tokens: POAPTokenWithEvent[] = []

  $: tokens = collectItems(set, max, tokens, $query.data?.tokens, ({ id }) => id)
</script>

<AppFrame>
  <div class="grid h-full">
    {#if $query.error}
      <ErrorMessage error={$query.error} />
    {:else if tokens}
      <div class="grid grid-cols-1 auto-rows-min gap-2 py-2 w-full">
        {#each tokens as token (token.id)}
          <Token {token} event={token.event} />
        {/each}
      </div>
    {:else}
      <div class="place-self-center">
        <Loading />
      </div>
    {/if}
  </div>
</AppFrame>
