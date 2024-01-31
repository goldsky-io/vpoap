<script lang="ts">
  import { queryPOAPEvents } from '$lib/client/poap'
  import { ErrorMessage } from '$lib/components/ErrorMessage'
  import { EventTokens } from '$lib/components/EventTokens'
  import { Loading } from '$lib/components/Loading'
  import { Seo } from '$lib/components/Seo'
  import type { PageData } from './$types'

  export let data: PageData

  const query = queryPOAPEvents(data.ids).poll()

  $: events = $query.data?.events
</script>

<Seo metadata={Object.values(data.metadata)} />

<div class="grid h-full">
  {#if $query.error}
    <ErrorMessage error={$query.error} />
  {:else if events}
    <EventTokens {events} metadata={data.metadata} max={data.max} />
  {:else}
    <div class="place-self-center">
      <Loading />
    </div>
  {/if}
</div>
