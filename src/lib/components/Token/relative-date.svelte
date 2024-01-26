<script lang="ts">
  import { formatDistanceToNow } from 'date-fns'
  import { readable } from 'svelte/store'

  export let seconds: string

  const ago = readable(formatSeconds(), (set) => {
    const interval = setInterval(() => {
      set(formatSeconds())
    }, 1000)
    return () => clearInterval(interval)
  })

  function formatSeconds() {
    return formatDistanceToNow(Number(seconds) * 1000, { includeSeconds: true, addSuffix: true })
  }
</script>

<p class="text-xs font-mono">{$ago}</p>
