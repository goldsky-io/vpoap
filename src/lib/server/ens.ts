import { createPublicClient, http, isAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { getEnsAvatar, getEnsName, normalize, getEnsText } from 'viem/ens'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export function ensName(address: string) {
  if (!isAddress(address)) return

  return getEnsName(client, { address })
}

export async function ensAvatar(ensName: string) {
  const name = normalize(ensName)
  const record = await getEnsText(client, { name, key: 'avatar' })
  // if there is no record then eject early
  if (!record) return

  // this will unforunately refetch the record again, but it's the only way we
  // can know when avatar parsing fails with a present avatar record
  const avatar = await getEnsAvatar(client, { name })
  if (avatar) return avatar

  // hopefully ens metadata can supply the avatar asset
  return `https://metadata.ens.domains/mainnet/avatar/${name}`
}
