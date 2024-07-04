<script lang="ts">
  import { queryPOAPTokens } from '$lib/client/poap'
  import { AppFrame } from '$lib/components/AppFrame'
  import { LoadableQuery } from '$lib/components/Loadable'
  import { Tokens } from '$lib/components/Tokens'
  import type { PageData } from './$types'

  export let data: PageData

  const query = queryPOAPTokens(data.max, data.initialData).poll()
  $: context = { tokenId: $query.data?.tokens[0].id }
</script>

<AppFrame {context}>
  <LoadableQuery {query} let:loaded>
    {#await Promise.all([data.streamed.metadata, data.streamed.ens])}
      <Tokens tokenData={loaded} max={data.max} />
    {:then [metadata, ens]}
      <Tokens tokenData={loaded} max={data.max} {metadata} {ens} />
    {:catch}
      <Tokens tokenData={loaded} max={data.max} />
    {/await}
  </LoadableQuery>
</AppFrame>
