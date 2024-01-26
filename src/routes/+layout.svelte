<script lang="ts">
  import { initializeGraphQL } from '$lib/client/graphql'
  import '$lib/styles/app.css'

  initializeGraphQL()
</script>

<div class="flex flex-col min-h-screen max-h-screen">
  <header class="relative border-b border-neutral-400/25">
    <div class="text-center">header</div>
  </header>
  <main class="flex-1 flex relative overflow-y-auto">
    <div class="container mx-auto">
      <slot />
    </div>
  </main>
  <footer class="relative border-t border-neutral-400/25">
    <div class="text-center">footer</div>
  </footer>
</div>
