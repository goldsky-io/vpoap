<script lang="ts">
  import { createIcon } from '@download/blockies'
  import { browser } from '$app/environment'
  export let address: string

  let container: HTMLDivElement

  $: canvas = browser
    ? createIcon({
        seed: address,
        size: 18,
        scale: 8,
      })
    : undefined

  $: if (container && canvas) {
    container.appendChild(canvas)
  }
</script>

<div class="contents [&_>canvas]:h-28 sm:[&_>canvas]:h-36" bind:this={container} />
