<script lang="ts">
  import {
    queryPOAPAccount,
    type FetchPOAPAccountData,
    type FetchPOAPTokensData,
  } from '$lib/client/poap'
  import { AppFrame } from '$lib/components/AppFrame'
  import { ErrorMessage } from '$lib/components/ErrorMessage'
  import { LoadableQuery } from '$lib/components/Loadable'
  import { Tokens } from '$lib/components/Tokens'
  import type { PageData } from './$types'

  export let data: PageData

  const query = queryPOAPAccount(data.address, data.max, data.initialData).poll()
  $: context = { account: data.address }

  function accountTokenData<T extends FetchPOAPAccountData>({
    account,
    ens,
    metadata,
  }: T): FetchPOAPTokensData | undefined {
    if (!account) return

    return {
      tokens: account.tokens,
      metadata,
      ens,
    }
  }
</script>

<AppFrame route="/account" {context}>
  <LoadableQuery {query} let:loaded>
    {@const tokenData = accountTokenData(loaded)}
    {#if tokenData}
      {#await data.streamed.metadata}
        <Tokens {tokenData} max={data.max} ens={data.ens} />
      {:then metadata}
        <Tokens {tokenData} max={data.max} {metadata} ens={data.ens} />
      {:catch}
        <Tokens {tokenData} max={data.max} ens={data.ens} />
      {/await}
    {:else}
      <ErrorMessage
        error="Account not found: {data.account === data.address
          ? data.account
          : `${data.address} (${data.account})`}"
      />
    {/if}
  </LoadableQuery>
</AppFrame>
