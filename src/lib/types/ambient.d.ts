declare module '@download/blockies' {
  import type { Canvas } from '@napi-rs/canvas'
  interface Options {
    seed?: string
    color?: string
    bgcolor?: string
    size?: number
    scale?: number
  }

  export function createIcon(opts: Options): HTMLCanvasElement
  export function renderIcon(opts: Options, canvas: HTMLCanvasElement | Canvas): HTMLCanvasElement
}

declare module '*.woff?arraybuffer' {
  const content: ArrayBuffer
  export default content
}

declare module '*.png?arraybuffer' {
  const content: ArrayBuffer
  export default content
}
