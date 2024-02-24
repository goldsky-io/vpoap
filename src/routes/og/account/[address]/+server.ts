import { error } from '@sveltejs/kit'
import { fetchReverseENS } from '$lib/server/ens'
import { fetchLatestAccountPOAPToken } from '$lib/server/poap'
import { tokenResponse } from '../../token/[id]/tokenResponse'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params, url, fetch }) => {
  const address = await fetchReverseENS(params.address)
  if (!address) throw error(422, `Invalid address: ${params.address}`)

  const { data, error: accountError } = await fetchLatestAccountPOAPToken(address, fetch)

  if (accountError) {
    console.error('Failed to fetch POAP account', address, accountError)
    throw error(422, 'Failed to fetch POAP account')
  }

  if (!data) {
    console.error('Failed to fetch POAP account data', address)
    throw error(422, 'Failed to fetch POAP account data')
  }

  if (!data.account) {
    console.error('POAP account not found', address, params.address)
    throw error(404, 'POAP account not found')
  }

  const tokenId = data.account.tokens[0]?.id
  if (!tokenId) throw error(404, 'POAP token not found for account')

  const _static = url.searchParams.get('static') === 'true'
  return tokenResponse(tokenId, fetch, _static)
}
