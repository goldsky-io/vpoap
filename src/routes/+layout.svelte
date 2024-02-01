<script lang="ts">
  import { initializeGraphQL } from '$lib/client/graphql'
  import '$lib/styles/app.css'

  initializeGraphQL()
</script>

<div class="flex flex-col min-h-[100dvh] max-h-[100dvh]">
  <slot />
</div>
