import { renderIcon } from '@download/blockies'
import { createCanvas } from '@napi-rs/canvas'
import { error } from '@sveltejs/kit'
import { loadTokenData } from '../../../../token/[id]/data'
import backgroundImage from '../og-background.png?arraybuffer'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, url, params }) => {
  const data = await loadTokenData(params.id, fetch)
  if (!data.token) {
    throw error(404, 'Token not found')
  }

  const _static = url.searchParams.has('static')
  const { token, metadata, ens } = data

  if (_static) {
    ens.avatar = undefined
    token.owner.id = '0x0000000000000000000000000000000000000000'
  }

  const avatar =
    ens.avatar ||
    renderIcon(
      {
        seed: token.owner.id,
        size: 20,
        scale: 10,
      },
      createCanvas(200, 200),
    ).toDataURL()

  const background = `data:image/png;base64,${Buffer.from(backgroundImage).toString('base64')}`

  return {
    token,
    metadata,
    ens,
    avatar,
    background,
    isStatic: _static,
  }
}
