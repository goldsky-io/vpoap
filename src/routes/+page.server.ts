import { MaxItems } from '$lib/client/constants'
import { fetchENSBatch } from '$lib/server/ens'
import { fetchPOAPMetadataBatch, fetchPOAPTokens } from '$lib/server/poap'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch }) => {
  const max = MaxItems
  const query = await fetchPOAPTokens(max, fetch)

  return {
    max,
    initialData: query.data,
    streamed: {
      metadata: fetchPOAPMetadataBatch(query.data?.tokens, fetch),
      ens: fetchENSBatch(query.data?.tokens),
    },
  }
}
