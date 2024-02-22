import { MaxItems } from '$lib/client/constants'
import { fetchPOAPTokens } from '$lib/server/poap'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, url }) => {
  const max = Number(url.searchParams.get('max')) || MaxItems

  const query = await fetchPOAPTokens(max, fetch)

  return { max, initialData: query.data }
}
