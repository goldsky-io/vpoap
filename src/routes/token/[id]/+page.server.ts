import type { PageServerLoad } from './$types'
import { loadTokenData } from './data'

export const load: PageServerLoad = ({ fetch, params }) => {
  return loadTokenData(params.id, fetch)
}
