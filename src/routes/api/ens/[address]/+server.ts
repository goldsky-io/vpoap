import { error, json, type RequestHandler } from '@sveltejs/kit'
import { ensAvatar, ensName } from '$lib/server/ens'

export const POST: RequestHandler = async ({ params }) => {
  const { address } = params
  if (!address) throw error(422, 'Missing address')

  const name = await ensName(address)
  if (!name) return json({})

  const avatarData = await ensAvatar(name)
  const avatar = avatarData ? `https://metadata.ens.domains/mainnet/avatar/${name}` : undefined

  return json({ name, avatar })
}
