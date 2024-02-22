<script lang="ts">
  import { setContextClient } from '@urql/svelte'
  import { createClient } from '$lib/client/graphql'
  import '$lib/styles/app.css'

  setContextClient(createClient())
</script>

<div class="flex flex-col min-h-[100dvh] max-h-[100dvh]">
  <slot />
</div>
