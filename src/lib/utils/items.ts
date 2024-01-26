export function collectItems<Item, ID>(
  set: Set<ID>,
  max: number,
  current: Item[],
  next: Item[] | undefined,
  itemId: (item: Item) => ID,
) {
  if (!next) return current

  const adds: Item[] = []

  for (const item of next) {
    const id = itemId(item)
    if (set.has(id)) continue

    set.add(id)
    adds.push(item)

    if (adds.length === max) break
  }

  if (set.size > max || adds.length > 0) {
    return adds.concat(current.slice(0, max - adds.length))
  }

  return current
}
