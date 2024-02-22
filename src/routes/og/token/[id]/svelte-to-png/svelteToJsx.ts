import type { ComponentType, SvelteComponent } from 'svelte'
import { toReactElement } from './toReactElement.js'

type SvelteSSRComponent = ComponentType<SvelteComponent> & {
  render: (props: Record<string, unknown>) => {
    html: string
    css: { code: string }
  }
}

export function svelteComponentToJsx(
  component: ComponentType<SvelteComponent>,
  props: Record<string, unknown>,
) {
  if (!isSvelteSSRComponent(component)) throw new Error('Component is not a Svelte SSR component')

  const SvelteRenderedMarkup = component.render(props)
  let htmlTemplate = SvelteRenderedMarkup.html || ''

  if (SvelteRenderedMarkup.css.code) {
    htmlTemplate = `${htmlTemplate}<style>${SvelteRenderedMarkup.css.code}</style>`
  }

  return toReactElement(htmlTemplate)

  function isSvelteSSRComponent(
    component: ComponentType<SvelteComponent>,
  ): component is SvelteSSRComponent {
    return Boolean('render' in component && typeof component.render === 'function')
  }
}
