import { renderIcon } from '@download/blockies'
import inter400 from '@fontsource/inter/files/inter-latin-400-normal.woff?arraybuffer'
import inter600 from '@fontsource/inter/files/inter-latin-600-normal.woff?arraybuffer'
import robotoMono400 from '@fontsource/roboto-mono/files/roboto-mono-latin-400-normal.woff?arraybuffer'
import { error } from '@sveltejs/kit'
import { createCanvas } from '@napi-rs/canvas'
import type { Fetch } from '$lib/client/types'
import { loadTokenData } from '../../../token/[id]/data'
import backgroundImage from './og-background.png?arraybuffer'
import OgToken from './og-token.svelte'
import { svelteToPngResponse } from './svelte-to-png'

export async function tokenResponse(id: string, fetch: Fetch) {
  try {
    const props = await loadTokenData(id, fetch)
    if (!props.token) throw error(404, 'Token not found')

    const avatar =
      props.ens.avatar ||
      renderIcon(
        {
          seed: props.token.owner.id,
          size: 20,
          scale: 10,
        },
        createCanvas(200, 200),
      ).toDataURL()

    const background = `data:image/png;base64,${Buffer.from(backgroundImage).toString('base64')}`

    return await svelteToPngResponse(
      OgToken,
      { ...props, avatar, background },
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'sans-serif',
            data: inter400,
            weight: 400,
          },
          {
            name: 'sans-serif',
            data: inter600,
            weight: 600,
          },
          {
            name: 'monospace',
            data: robotoMono400,
            weight: 400,
          },
        ],
      },
    )
  } catch (err) {
    console.error('error building opengraph image', err)
    throw error(500, err instanceof Error ? err.message : 'Opengraph image error')
  }
}
