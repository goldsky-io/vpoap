import { tokenResponse } from './tokenResponse'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = ({ params: { id }, url, fetch }) => {
  const _static = url.searchParams.get('static') === 'true'
  return tokenResponse(id, fetch, _static)
}
