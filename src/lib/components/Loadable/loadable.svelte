<script lang="ts">
  import { ErrorMessage } from '../ErrorMessage'
  import { Loading } from '../Loading'

  type T = $$Generic
  type $$Slots = { default: { loaded: T } }

  export let error: unknown
  export let data: T | null | undefined
</script>

<div class="grid h-full">
  {#if error}
    <ErrorMessage {error} />
  {:else if data}
    <slot loaded={data} />
  {:else}
    <div class="place-self-center">
      <Loading />
    </div>
  {/if}
</div>
