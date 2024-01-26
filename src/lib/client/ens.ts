import { fetchJson } from './json'
import type { ENSRecords } from '$lib/types/poap'

const apiBasePath = '/api/ens'

export function fetchENS(address: string) {
  return fetchJson<ENSRecords>([apiBasePath, address].join('/'), {
    method: 'POST',
  })
}
