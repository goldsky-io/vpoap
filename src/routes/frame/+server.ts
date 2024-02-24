import { error } from '@sveltejs/kit'
import { getFrameHtml, validateFrameMessage, type FrameActionPayload } from 'frames.js'
import type { SeoContext } from '$lib/components/Seo'
import { fetchLatestPOAPToken } from '$lib/server/poap'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, url, fetch }) => {
  const baseUrl = import.meta.env.DEV ? 'http://localhost:5173' : 'https://vpoap.vercel.app'
  const context = JSON.parse(url.searchParams.get('context') || '{}') as SeoContext
  const action = url.searchParams.get('action') || 'latest'
  const body = (await request.json()) as FrameActionPayload

  const { isValid, message } = await validateFrameMessage(body)
  if (!isValid || !message) {
    if (!import.meta.env.DEV) throw error(400, 'Invalid frame payload')
  }

  const html = getFrameHtml({
    image: await imageUrl(),
    version: 'vNext',
    buttons: [
      {
        label: `🔄 Refresh ${action}`,
        action: 'post',
      },
    ],
    postUrl: `${baseUrl}/frame${url.search}`,
  })

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
    status: 200,
  })

  async function imageUrl() {
    const at = new Date().getTime()
    if (context.eventIds) return `${baseUrl}/og/event/${context.eventIds.join(',')}?at=${at}`
    if (context.account) return `${baseUrl}/og/account/${context.account}?at=${at}`

    const { data, error: tokenError } = await fetchLatestPOAPToken(fetch)

    if (tokenError) {
      console.error('Failed to fetch POAP token', tokenError)
      throw error(422, 'Failed to fetch POAP token')
    }

    if (!data) {
      console.error('Failed to fetch POAP token data')
      throw error(422, 'Failed to fetch POAP token data')
    }

    if (!data.tokens || data.tokens.length === 0) {
      console.error('POAP token not found')
      throw error(404, 'POAP token not found')
    }

    const tokenId = data.tokens[0]?.id
    if (!tokenId) throw error(404, 'POAP token missing id')

    return `${baseUrl}/og/token/${tokenId}?at=${at}`
  }
}
