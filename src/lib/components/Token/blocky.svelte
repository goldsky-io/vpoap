<script lang="ts">
  import { createIcon } from '@download/blockies'
  export let address: string

  let container: HTMLDivElement

  const canvas = createIcon({
    seed: address,
    size: 15,
    scale: 10,
  })

  $: if (container) {
    container.appendChild(canvas)
  }
</script>

<div class="contents" bind:this={container} />
