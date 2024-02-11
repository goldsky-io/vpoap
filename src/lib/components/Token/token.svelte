<script lang="ts">
  import { expoIn, expoOut } from 'svelte/easing'
  import { fly, fade } from 'svelte/transition'
  import { page } from '$app/stores'
  import { fetchENS } from '$lib/client/ens'
  import { fetchPOAPMetadata } from '$lib/client/poap'
  import type { ENSRecords } from '$lib/types/ens'
  import type { POAPEvent, POAPEventMetadata, POAPToken } from '$lib/types/poap'
  import { Loading } from '../Loading'
  import Account from './account.svelte'
  import Blocky from './blocky.svelte'
  import Metadata from './metadata.svelte'
  import RelativeDate from './relative-date.svelte'

  export let token: POAPToken
  export let event: POAPEvent
  export let metadata: POAPEventMetadata | undefined = undefined
  export let ens: ENSRecords | undefined = undefined

  let avatarLoaded = false

  $: eventId = event.id

  $: if (!metadata) {
    fetchPOAPMetadata(eventId)
      .then((data) => {
        metadata = data
      })
      .catch(console.error)
  }

  $: if (!ens) {
    fetchENS(token.owner.id)
      .then((res) => {
        ens = res
      })
      .catch(console.error)
  }
</script>

<div
  class="grid grid-cols-2 lg:grid-cols-[var(--grid-size),1fr,var(--grid-size)] grid-rows-[var(--grid-size),1fr] lg:grid-rows-[--grid-size] gap-y-4 w-full h-[calc(var(--grid-size)*2.5)] lg:h-[--grid-size] border border-black/30 rounded-xl shadow-xl overflow-hidden transition-all"
  style:--grid-size="12rem"
  in:fly={{ duration: 200, easing: expoIn, y: '-50%', opacity: 0.1 }}
  out:fly={{ duration: 300, easing: expoOut, y: '50%', opacity: 0.1 }}
>
  <div
    class="order-1 grid place-items-center bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-black to-black/40 text-neutral-200 p-1 sm:p-4"
    in:fade={{ delay: 100 }}
  >
    <div class="bg-white/80 rounded-lg p-2 drop-shadow-lg">
      <a
        href="https://www.ondora.xyz/network/ethereum/accounts/{token.owner.id}"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="grid grid-cols-1 grid-rows-1">
          {#if ens && ens.name && ens.avatar}
            {@const { name, avatar } = ens}
            <img
              class="[grid-area:1/1] object-scale-down h-28 sm:h-36 aspect-square"
              src={avatar}
              alt="{name} avatar"
              on:error={() => {
                console.log(`Unable to load avatar for ${name}`, avatar)
              }}
              on:load={() => {
                avatarLoaded = true
              }}
            />
          {/if}
          {#if !avatarLoaded}
            <div class="z-10 [grid-area:1/1]" transition:fade>
              <Blocky address={token.owner.id} />
            </div>
          {/if}
        </div>
      </a>
    </div>
  </div>
  <div
    class="order-3 lg:order-2 col-span-2 lg:col-span-1 flex flex-col gap-1 p-4 overflow-x-hidden"
    in:fade={{ delay: 200 }}
  >
    {#if metadata}
      <Metadata {token} {metadata} />
    {/if}
    <div
      class="grid grid-rows-2 sm:grid-rows-1 grid-cols-2 sm:grid-cols-[auto,auto,auto] lg:grid-cols-[1fr,auto,1fr] items-center"
    >
      <div class="col-span-2 sm:col-span-1">
        <Account account={token.owner} {ens} />
      </div>
      <div>
        <a
          class="text-indigo-700 hover:brightness-110 hover:underline sm:text-center font-mono font-medium transition-all"
          href={`https://app.poap.xyz/token/${token.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          #{token.mintOrder}
        </a>
        {#if $page.route.id !== '/token/[id]'}
          (<a
            class="text-indigo-700 hover:brightness-110 hover:underline sm:text-center font-mono font-medium transition-all"
            href={`/token/${token.id}`}>#{token.id}</a
          >)
        {/if}
      </div>
      <div class="text-right">
        <RelativeDate seconds={token.created} />
      </div>
    </div>
  </div>
  <div
    class="order-2 lg:order-3 grid place-items-center bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-black to-black/40 p-1 sm:p-4 overflow-hidden"
    in:fade={{ delay: 300 }}
  >
    {#if metadata}
      <div class="bg-white/80 rounded-full p-1 drop-shadow-lg">
        <a
          href={`https://poap.gallery/event/${metadata.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            class="rounded-full object-scale-down h-[7.5rem] sm:h-[9.5rem] aspect-square"
            src={metadata.image_url}
            alt="{metadata.name} POAP image"
          />
        </a>
      </div>
    {:else}
      <Loading />
    {/if}
  </div>
</div>
