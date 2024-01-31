import type { ENSRecords } from '$lib/types/poap'
import { Cache } from './cache'
import { fetchJson } from './json'

const apiBasePath = '/api/ens'
const ensCache = new Cache<string, ENSRecords>()

export function fetchENS(address: string) {
  return ensCache.get(address, () =>
    fetchJson<ENSRecords>([apiBasePath, address].join('/'), {
      method: 'POST',
    }),
  )
}
