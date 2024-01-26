<script lang="ts">
  import { createIcon } from '@download/blockies'
  export let address: string

  let container: HTMLDivElement

  const canvas = createIcon({
    seed: address,
    size: 18,
    scale: 8,
  })

  $: if (container) {
    container.appendChild(canvas)
  }
</script>

<div class="contents [&_>canvas]:h-28 sm:[&_>canvas]:h-36" bind:this={container} />
