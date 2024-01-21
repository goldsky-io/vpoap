<script lang="ts">
  import '$lib/styles/app.css'
</script>

<div class="flex flex-col min-h-screen">
  <header class="relative">
    <div class="text-center">header</div>
  </header>
  <main class="flex-1 flex relative">
    <div class="container mx-auto">
      <slot />
    </div>
  </main>
  <footer class="relative">
    <div class="text-center">footer</div>
  </footer>
</div>
