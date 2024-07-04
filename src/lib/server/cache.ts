import { kv } from '@vercel/kv'
import { KV_REST_API_TOKEN } from '$lib/server/env'
import type { ENSRecords } from '$lib/types/ens'
import type { POAPEventMetadata } from '$lib/types/poap'

type CacheType = 'ens' | 'metadata'

function cacheKey(type: CacheType, id: string) {
  return [type, id].join('-')
}

export async function cacheFetch(
  type: 'ens',
  id: string,
  fetch: () => Promise<ENSRecords>,
): Promise<ENSRecords | undefined>
export async function cacheFetch(
  type: 'metadata',
  id: string,
  fetch: () => Promise<POAPEventMetadata>,
): Promise<POAPEventMetadata | undefined>
export async function cacheFetch(
  type: CacheType,
  id: string,
  fetch: () => Promise<unknown>,
): Promise<ENSRecords | POAPEventMetadata | undefined> {
  if (!KV_REST_API_TOKEN) return
  const key = cacheKey(type, id)

  try {
    const value = await kv.get(key)
    if (value) {
      if (typeof value === 'string') {
        console.info(
          `[${new Date().toISOString()}] Cache hit, but it's still fetching: ${key} / ${value}`,
        )
      } else {
        return value
      }
    } else {
      // no await here so that we return undefined immediately
      kv.set(key, new Date().toISOString(), { ex: 60 })
        .then(fetch)
        .then((value) => kv.set(key, value, { ex: 3600 }))
        .catch((err) => {
          console.error(`[${new Date().toISOString()}] error caching: ${key}`, err)
          kv.del(key).catch(console.error)
        })
    }
  } catch (err) {
    console.warn(`[${new Date().toISOString()}] ejecting cache: ${key}`)
    // something went wrong, so eject the key and we'll start over
    await kv.del(key)
    // then rethrow so we can handle the error upstream
    throw err
  }
}
