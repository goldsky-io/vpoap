import { tokenResponse } from './tokenResponse'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = ({ params: { id }, fetch }) => {
  return tokenResponse(id, fetch, true)
}
