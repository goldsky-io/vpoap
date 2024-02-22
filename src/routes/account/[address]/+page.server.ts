import { error } from '@sveltejs/kit'
import { MaxItems } from '$lib/client/constants'
import { fetchReverseENS } from '$lib/server/ens'
import { fetchPOAPAccount } from '$lib/server/poap'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, params, url }) => {
  const address = await fetchReverseENS(params.address)
  if (!address) throw error(422, `Invalid address: ${params.address}`)

  const max = Number(url.searchParams.get('max')) || MaxItems

  const query = await fetchPOAPAccount(address, max, fetch)

  return { account: params.address, address, max, initialData: query.data }
}
