import { error, json } from '@sveltejs/kit'
import { fetchPOAPMetadata } from '$lib/server/poap'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ params, fetch }) => {
  try {
    const { id } = params
    if (!id) throw error(422, 'Missing POAP event ID')

    const eventId = Number(id)
    if (!Number.isInteger(eventId)) throw error(422, 'Invalid POAP event ID')

    const metadata = await fetchPOAPMetadata(eventId, fetch)
    if (!metadata) throw error(404, 'POAP event not found')

    return json(metadata)
  } catch (err) {
    console.error('error fetching POAP metadata', err)
    throw error(500, err instanceof Error ? err.message : 'POAP metadata fetch error')
  }
}
