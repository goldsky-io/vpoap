import { error, json, type RequestHandler } from '@sveltejs/kit'
import { ensAvatar, ensName } from '$lib/server/ens'

export const POST: RequestHandler = async ({ params }) => {
  try {
    const { address } = params
    if (!address) throw error(422, 'Missing address')

    const name = await ensName(address)
    if (!name) return json({})

    const avatar = await ensAvatar(name)

    return json({ name, avatar })
  } catch (err) {
    console.error('error fetching ENS metadata', err)
    throw error(500, err instanceof Error ? err.message : 'ENS metadata fetch error')
  }
}
