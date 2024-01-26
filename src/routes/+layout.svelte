<script lang="ts">
  import { initializeGraphQL } from '$lib/client/graphql'
  import '$lib/styles/app.css'

  initializeGraphQL()
</script>

<div class="flex flex-col min-h-[100dvh] max-h-[100dvh]">
  <header class="relative bg-neutral-700 border-b border-black/25 text-neutral-200">
    <div class="text-center">
      Watch <a
        class="text-indigo-300 hover:brightness-110 font-semibold transition-all"
        href="https://poap.xyz"
        target="_blank"
        rel="noopener noreferrer"
      >
        POAP
      </a> mints live!
    </div>
  </header>
  <main class="flex-1 flex relative overflow-y-auto bg-neutral-300">
    <div class="container mx-auto px-2">
      <slot />
    </div>
  </main>
  <footer class="relative py-1 bg-neutral-700 border-t border-black/25 text-neutral-200">
    <div class="text-center">
      Powered by <a
        class="text-[#ffbf60] hover:brightness-110 font-semibold transition-all"
        href="https://goldsky.com/products/subgraphs"
        target="_blank"
        rel="noopener noreferrer"
      >
        Goldsky
      </a> subgraphs
    </div>
  </footer>
</div>
