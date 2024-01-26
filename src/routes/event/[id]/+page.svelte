<script lang="ts">
  import { queryPOAPEvent } from '$lib/client/poap'
  import { ErrorMessage } from '$lib/components/ErrorMessage'
  import { EventTokens } from '$lib/components/EventTokens'
  import { Loading } from '$lib/components/Loading'
  import { Seo } from '$lib/components/Seo'
  import type { PageData } from './$types'

  export let data: PageData

  const query = queryPOAPEvent(data.id).poll()

  $: event = $query.data?.event
</script>

<Seo metadata={data.metadata} />

<div class="grid h-full">
  {#if $query.error}
    <ErrorMessage error={$query.error} />
  {:else if event}
    <EventTokens {event} metadata={data.metadata} />
  {:else}
    <div class="place-self-center">
      <Loading />
    </div>
  {/if}
</div>
