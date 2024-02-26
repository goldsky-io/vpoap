<script lang="ts">
  import { queryPOAPAccount } from '$lib/client/poap'
  import { AppFrame } from '$lib/components/AppFrame'
  import { ErrorMessage } from '$lib/components/ErrorMessage'
  import { LoadableQuery } from '$lib/components/Loadable'
  import { Tokens } from '$lib/components/Tokens'
  import type { PageData } from './$types'

  export let data: PageData

  const query = queryPOAPAccount(data.address, data.max, data.initialData).poll()
  $: context = { account: data.address }
</script>

<AppFrame route="/account" {context}>
  <LoadableQuery {query} let:loaded={{ account }}>
    {#if account}
      <Tokens tokenData={account} max={data.max} />
    {:else}
      <ErrorMessage
        error="Account not found: {data.account === data.address
          ? data.account
          : `${data.address} (${data.account})`}"
      />
    {/if}
  </LoadableQuery>
</AppFrame>
