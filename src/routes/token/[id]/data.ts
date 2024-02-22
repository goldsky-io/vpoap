import { error } from '@sveltejs/kit'
import type { Fetch } from '$lib/client/types'
import { fetchENS } from '$lib/server/ens'
import { fetchPOAPMetadata, fetchPOAPToken } from '$lib/server/poap'

export async function loadTokenData(token_id: string, fetch: Fetch) {
  const id = Number(token_id.trim())
  if (!Number.isInteger(id)) {
    console.error('Invalid POAP event ID', id)
    throw error(422, 'Invalid POAP event ID')
  }

  const { data, error: tokenError } = await fetchPOAPToken(id, fetch)
  if (tokenError) {
    console.error('Failed to fetch POAP token', id, tokenError)
    throw error(422, 'Failed to fetch POAP token')
  }

  if (!data) {
    console.error('Failed to fetch POAP token data', id)
    throw error(422, 'Failed to fetch POAP token data')
  }

  if (!data.token) {
    console.error('POAP token not found', id)
    return { id }
  }

  const { token } = data
  const metadata = await fetchPOAPMetadata(Number(token.event.id), fetch)

  const ens = await fetchENS(token.owner.id)

  return { id, token, metadata, ens }
}
