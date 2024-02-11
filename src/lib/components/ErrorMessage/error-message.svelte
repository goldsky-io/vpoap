<script lang="ts">
  import { onMount } from 'svelte'

  export let error: unknown

  let node: HTMLParagraphElement

  $: message = errorMessage(error)

  function errorMessage(error: unknown) {
    if (error instanceof Error || isErrorLike(error)) {
      return error.message
    } else if (typeof error === 'string') {
      return error
    } else {
      return 'Unknown error'
    }

    function isErrorLike(error: unknown): error is { message: string } {
      return Boolean(
        error &&
          typeof error === 'object' &&
          'message' in error &&
          typeof error.message === 'string',
      )
    }
  }

  onMount(() => {
    node.scrollIntoView({ behavior: 'smooth' })
  })
</script>

<div class="container mx-auto flex items-center justify-center">
  <p bind:this={node} class="error-message text-red-600 font-semibold">{message}</p>
</div>
