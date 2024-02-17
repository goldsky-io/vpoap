declare module '@download/blockies' {
  import type { Canvas } from 'canvas'
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
