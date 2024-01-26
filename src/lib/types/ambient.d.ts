declare module '@download/blockies' {
  export function createIcon(opts: {
    seed?: string
    color?: string
    bgcolor?: string
    size?: number
    scale?: number
  }): HTMLCanvasElement
}
