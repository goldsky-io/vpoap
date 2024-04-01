import { error } from '@sveltejs/kit'
import { MAINTENANCE_MODE } from '$lib/server/env'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = () => {
  if (!MAINTENANCE_MODE) return {}

  throw error(503, 'Service Unavailable')
}
