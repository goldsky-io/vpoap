<script lang="ts">
  import OgToken from '../og-token.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<div class="flex-1 grid place-items-center">
  <div class="w-[1200px] h-[630px]">
    <OgToken {...data} />
  </div>
</div>
