import { error } from '@sveltejs/kit'
import { MaxItems } from '$lib/client/constants'
import { fetchENS, fetchReverseENS } from '$lib/server/ens'
import { fetchPOAPAccount, fetchPOAPMetadataBatch } from '$lib/server/poap'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, params, url }) => {
  const address = await fetchReverseENS(params.address)
  if (!address) throw error(422, `Invalid address: ${params.address}`)

  const max = Number(url.searchParams.get('max')) || MaxItems

  const query = await fetchPOAPAccount(address, max, fetch)
  const ens = await fetchENS(address)

  return {
    account: params.address,
    ens: { [address]: ens },
    address,
    max,
    initialData: query.data,
    streamed: {
      metadata: fetchPOAPMetadataBatch(query.data?.account?.tokens, fetch),
    },
  }
}
