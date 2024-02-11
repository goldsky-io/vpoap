<script lang="ts">
  import { AppFrame } from '$lib/components/AppFrame'
  import { ErrorMessage } from '$lib/components/ErrorMessage'
  import { Token } from '$lib/components/Token'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<AppFrame metadata={data.metadata ? [data.metadata] : undefined}>
  <div class="grid h-full">
    {#if !data.token}
      <ErrorMessage error="Token not found: #{data.id}" />
    {:else}
      <div class="grid place-content-center py-2 w-full">
        <Token
          token={data.token}
          event={data.token.event}
          metadata={data.metadata}
          ens={data.ens}
        />
      </div>
    {/if}
  </div>
</AppFrame>
