import { createEnsPublicClient } from '@ensdomains/ensjs'
import { getName, getRecords } from '@ensdomains/ensjs/public'
import { http, type Address } from 'viem'
import { mainnet } from 'viem/chains'

const client = createEnsPublicClient({
  chain: { ...mainnet, network: 'homestead' },
  transport: http(),
})

export function ensName(address: string) {
  return getName(client, { address: address as Address }).then((data) => data?.name)
}

export function ensAvatar(name: string) {
  return getRecords(client, {
    name,
    texts: ['avatar'],
  }).then((records) => records.texts[0]?.value)
}
