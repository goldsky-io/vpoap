<script lang="ts">
  import { queryPOAPEvents } from '$lib/client/poap'
  import { AppFrame } from '$lib/components/AppFrame'
  import { EventTokens } from '$lib/components/EventTokens'
  import { LoadableQuery } from '$lib/components/Loadable'
  import type { PageData } from './$types'

  export let data: PageData

  const query = queryPOAPEvents(data.ids, data.max, data.initialData).poll()
</script>

<AppFrame route="/event" metadata={Object.values(data.metadata)} context={{ eventIds: data.ids }}>
  <LoadableQuery {query} let:loaded={{ events }}>
    <EventTokens {events} metadata={data.metadata} max={data.max} />
  </LoadableQuery>
</AppFrame>
