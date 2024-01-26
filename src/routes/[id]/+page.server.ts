import { error } from '@sveltejs/kit'
import { fetchPOAPMetadata } from '$lib/server/poap'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, params }) => {
  if (!params.id || !Number.isInteger(Number(params.id))) {
    console.error('Invalid POAP event ID', params.id)
    throw error(422, 'Invalid POAP event ID')
  }

  const id = Number(params.id)
  const metadata = await fetchPOAPMetadata(id, fetch)

  return { id, metadata }
}
