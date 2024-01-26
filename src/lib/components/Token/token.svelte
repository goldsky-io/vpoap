<script lang="ts">
  import { fetchENS } from '$lib/client/ens'
  import { fetchPOAPMetadata } from '$lib/client/poap'
  import type { ENSRecords, POAPEvent, POAPEventMetadata, POAPToken } from '$lib/types/poap'
  import { Loading } from '../Loading'
  import Account from './account.svelte'
  import Blocky from './blocky.svelte'
  import Metadata from './metadata.svelte'
  import RelativeDate from './relative-date.svelte'

  export let token: POAPToken
  export let event: POAPEvent
  export let metadata: POAPEventMetadata | undefined = undefined

  let ens: ENSRecords = {}

  $: eventId = event.id
  $: account = token.owner.id

  $: if (!metadata) {
    fetchPOAPMetadata(eventId)
      .then((data) => {
        metadata = data
      })
      .catch(console.error)
  }

  $: {
    fetchENS(account)
      .then((res) => {
        ens = res
      })
      .catch(console.error)
  }
</script>

<div
  class="grid grid-cols-1 lg:grid-cols-[var(--grid-size),1fr,var(--grid-size)] grid-rows-[var(--grid-size),1fr,var(--grid-size)] lg:grid-rows-[--grid-size] gap-4 w-full border border-neutral-400/50 rounded-xl shadow-lg overflow-hidden"
  style:--grid-size="12rem"
>
  <div class="grid place-items-center bg-neutral-600 text-neutral-200 p-4">
    {#if ens.avatar}
      <img class="object-scale-down w-40 h-40" src={ens.avatar} alt="{ens.name} avatar" />
    {:else}
      <Blocky address={token.owner.id} />
    {/if}
  </div>
  <div class="flex flex-col gap-1 p-4 overflow-x-hidden">
    {#if metadata}
      <Metadata {metadata} />
    {/if}
    <div
      class="grid grid-rows-2 sm:grid-rows-1 grid-cols-2 sm:grid-cols-[auto,auto,auto] lg:grid-cols-[1fr,auto,1fr] items-center"
    >
      <Account account={token.owner} {ens} />
      <p class="text-right sm:text-center">#{token.mintOrder}</p>
      <div class="col-span-2 sm:col-span-1 text-right">
        <RelativeDate seconds={token.created} />
      </div>
    </div>
  </div>
  <div class="grid place-items-center bg-neutral-600 p-4 overflow-hidden">
    {#if metadata}
      <a href="/{event.id}">
        <img
          class="rounded-full drop-shadow-lg object-scale-down w-40 h-40"
          src={metadata.image_url}
          alt="{metadata.name} POAP image"
        />
      </a>
    {:else}
      <Loading />
    {/if}
  </div>
</div>
