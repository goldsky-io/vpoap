<script lang="ts">
  import { queryPOAPEvents } from '$lib/client/poap'
  import { AppFrame } from '$lib/components/AppFrame'
  import { EventTokens } from '$lib/components/EventTokens'
  import { LoadableQuery } from '$lib/components/Loadable'
  import type { PageData } from './$types'

  export let data: PageData

  const query = queryPOAPEvents(data.ids, data.max, data.initialData).poll()
  $: context = { eventIds: data.ids }
  $: metadata = Object.values(data.metadata)
</script>

<AppFrame route="/event" {metadata} {context}>
  <LoadableQuery {query} let:loaded>
    {#await data.streamed.ens}
      <EventTokens eventData={loaded} max={data.max} metadata={data.metadata} />
    {:then ens}
      <EventTokens eventData={loaded} max={data.max} metadata={data.metadata} {ens} />
    {:catch}
      <EventTokens eventData={loaded} max={data.max} metadata={data.metadata} />
    {/await}
  </LoadableQuery>
</AppFrame>
