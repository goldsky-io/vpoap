import { error } from '@sveltejs/kit'
import { fetchLatestEventPOAPTokens } from '$lib/server/poap'
import { tokenResponse } from '../../token/[id]/tokenResponse'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params, fetch }) => {
  const ids = params.id
    .split(',')
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isInteger(id))
  if (ids.length === 0) {
    console.error('Invalid POAP event IDs', params.id)
    throw error(422, 'Invalid POAP event IDs')
  }

  const query = await fetchLatestEventPOAPTokens(ids, fetch)
  const tokenId = query.data?.events
    .flatMap(({ tokens }) => tokens)
    .sort((a, b) => Number(b.created) - Number(a.created))[0]?.id
  if (!tokenId) throw error(404, 'POAP token not found for events')

  return tokenResponse(tokenId, fetch)
}
