import { error, json, type RequestHandler } from '@sveltejs/kit'
import { fetchENS } from '$lib/server/ens'

export const POST: RequestHandler = async ({ params }) => {
  try {
    const { address } = params
    if (!address) throw error(422, 'Missing address')

    const ens = await fetchENS(address)

    return json(ens)
  } catch (err) {
    console.error('error fetching ENS metadata', err)
    throw error(500, err instanceof Error ? err.message : 'ENS metadata fetch error')
  }
}
