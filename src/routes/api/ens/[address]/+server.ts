import { error, json } from '@sveltejs/kit'
import { fetchENS } from '$lib/server/ens'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ params }) => {
  try {
    const { address } = params
    if (!address) throw error(422, 'Missing address')

    const ens = await fetchENS(address)

    return json(ens, {
      headers: {
        'Cache-Control': 'max-age=3600',
        'CDN-Cache-Control': 'max-age=3600',
        'Vercel-CDN-Cache-Control': 'max-age=3600',
      },
    })
  } catch (err) {
    console.error('error fetching ENS metadata', err)
    throw error(500, err instanceof Error ? err.message : 'ENS metadata fetch error')
  }
}
