import { error } from '@sveltejs/kit'
import { MaxItems } from '$lib/client/constants'
import { fetchPOAPEvents, fetchPOAPMetadata } from '$lib/server/poap'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, params, url }) => {
  const ids = params.id
    .split(',')
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isInteger(id))
  if (ids.length === 0) {
    console.error('Invalid POAP event IDs', params.id)
    throw error(422, 'Invalid POAP event IDs')
  }

  const max = Number(url.searchParams.get('max')) || MaxItems

  const [metadata, query] = await Promise.all([
    Promise.all(ids.map((id) => fetchPOAPMetadata(id, fetch))).then((metadata) =>
      Object.fromEntries(metadata.filter(Boolean).map((metadata) => [metadata.id, metadata])),
    ),
    fetchPOAPEvents(ids, max, fetch),
  ])

  return { ids, max, metadata, initialData: query.data }
}
