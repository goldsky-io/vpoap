import { createPublicClient, http, isAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { getEnsAvatar, getEnsName, normalize, getEnsText, getEnsAddress } from 'viem/ens'
import type { ENSRecords } from '$lib/types/ens'
import type { POAPToken } from '$lib/types/poap'
import { cacheFetch } from './cache'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export async function fetchENS(
  address: string,
  disableDefaultAvatarUrl = false,
): Promise<ENSRecords> {
  try {
    return await cacheFetch('ens', address, async () => {
      const name = await ensName(address)
      if (!name) return {}

      const avatar = await ensAvatar(name, disableDefaultAvatarUrl)

      return { name, avatar }
    }).then((value) => value || {})
  } catch (err) {
    console.error('error fetching ENS metadata', err)
    return {}
  }

  function ensName(address: string) {
    if (!isAddress(address)) return

    return getEnsName(client, { address })
  }

  async function ensAvatar(ensName: string, noDefault = false) {
    const name = normalize(ensName)
    const record = await getEnsText(client, { name, key: 'avatar' })
    // if there is no record then eject early
    if (!record) return

    // this will unforunately refetch the record again, but it's the only way we
    // can know when avatar parsing fails with a present avatar record
    const avatar = await getEnsAvatar(client, { name })
    if (avatar) return avatar
    if (noDefault) return

    // hopefully ens metadata can supply the avatar asset
    return `https://metadata.ens.domains/mainnet/avatar/${name}`
  }
}

export async function fetchENSBatch(tokens: POAPToken[] | undefined) {
  if (!tokens) return {}

  const addresses = Array.from(new Set(tokens.map((token) => token.owner.id)))
  const entries = await Promise.all(
    addresses.map((address) => fetchENS(address).then((ens) => [address, ens] as const)),
  )

  return Object.fromEntries(entries)
}

export function fetchReverseENS(address: string) {
  if (isAddress(address)) return Promise.resolve(address)

  try {
    return getEnsAddress(client, { name: normalize(address) })
  } catch (err) {
    console.error('error fetching reverse ENS', err)
    return Promise.resolve(undefined)
  }
}
