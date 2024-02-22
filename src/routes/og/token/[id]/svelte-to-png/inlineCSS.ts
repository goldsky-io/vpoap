import type { Style } from 'svelte/types/compiler/interfaces'

// 3. Make it better if possible
export function extractStyles(cssAst: Style) {
  const styles: Record<string, string> = {}
  if (Object.hasOwn(cssAst, 'children') && cssAst.children.length) {
    for (const { prelude, block } of cssAst.children) {
      if (hasChildren(prelude)) {
        for (const selector of prelude.children) {
          if (!hasClassnames(selector)) continue

          const classNames = selector.children
            .filter((node) => node.type === 'ClassSelector')
            .map((node) => node.name)
          for (const className of classNames) {
            if (!hasDeclarations(block)) continue

            styles[className] = block.children
              .map((declaration) => {
                return `${declaration.property}: ${declaration.value.children
                  .map((identifier) => {
                    return identifier.name
                  })
                  .join(' ')}`
              })
              .join('; ')
          }
        }
      }
    }
  }
  return styles

  function hasChildren(node: unknown): node is { children: unknown[] } {
    return Boolean(
      node &&
        typeof node === 'object' &&
        'children' in node &&
        Array.isArray(node.children) &&
        node.children.length > 0,
    )
  }

  function hasClassnames(node: unknown): node is { children: { type: string; name: string }[] } {
    if (!hasChildren(node)) return false

    const [first] = node.children

    return Boolean(
      first &&
        typeof first === 'object' &&
        'type' in first &&
        typeof first.type === 'string' &&
        'name' in first &&
        typeof first.name === 'string',
    )
  }

  function hasDeclarations(
    node: unknown,
  ): node is { children: { property: string; value: { children: { name: string }[] } }[] } {
    if (!hasChildren(node)) return false

    const [first] = node.children

    return Boolean(
      first &&
        typeof first === 'object' &&
        'property' in first &&
        typeof first.property === 'string' &&
        'value' in first &&
        typeof first.value === 'object' &&
        hasChildren(first.value) &&
        first.value.children[0] &&
        typeof first.value.children[0] === 'object' &&
        'name' in first.value.children[0] &&
        typeof first.value.children[0].name === 'string',
    )
  }
}
