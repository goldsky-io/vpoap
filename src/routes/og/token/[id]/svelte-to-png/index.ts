import { Resvg } from '@resvg/resvg-js'
import satori, { type SatoriOptions } from 'satori'
import type { ComponentType, SvelteComponent } from 'svelte'
import { svelteComponentToJsx } from './svelteToJsx'

// this is all a cleaned up version of https://github.com/etherCorps/svelte-og and https://github.com/etherCorps/svelte-h2j

export async function svelteToPngResponse(
  component: ComponentType<SvelteComponent>,
  props: Record<string, unknown>,
  options: SatoriOptions,
) {
  const reactElement = svelteComponentToJsx(component, props)
  const svg = await satori(reactElement, options)
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 'width' in options ? options.width : 1200,
    },
    font: {
      // It will be faster to disable loading system fonts.
      loadSystemFonts: false,
    },
  })
  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()
  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, immutable, no-transform, max-age=31536000',
    },
    status: 200,
  })
}
