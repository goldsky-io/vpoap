import { error } from '@sveltejs/kit'
import { getFrameHtml, validateFrameMessage, type FrameActionPayload } from 'frames.js'
import type { SeoContext } from '$lib/components/Seo'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, url }) => {
  const baseUrl = import.meta.env.DEV ? 'http://localhost:5173' : 'https://vpoap.vercel.app'
  const context = JSON.parse(url.searchParams.get('context') || '{}') as SeoContext
  const body = (await request.json()) as FrameActionPayload

  const { isValid, message } = await validateFrameMessage(body)
  if (!isValid || !message) {
    if (!import.meta.env.DEV) throw error(400, 'Invalid frame payload')
  }

  const html = getFrameHtml({
    image: imageUrl(),
    version: 'vNext',
    buttons: [
      {
        label: '🔄 Refresh latest',
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

  function imageUrl() {
    const at = new Date().getTime()
    if (context.tokenId) return `${baseUrl}/og/token/${context.tokenId}?at=${at}`
    if (context.eventIds) return `${baseUrl}/og/event/${context.eventIds.join(',')}?at=${at}`
    if (context.account) return `${baseUrl}/og/account/${context.account}?at=${at}`

    return `${baseUrl}/images/twitter-card.png`
  }
}
