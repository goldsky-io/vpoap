type CacheEntry<T> = { entry: T; expiry: number }

export class Cache<Key, Value> {
  private cache: Map<Key, CacheEntry<Value>>

  constructor(
    // 1 hour
    public ttl = 1000 * 60 * 60,
  ) {
    this.cache = new Map<Key, CacheEntry<Value>>()
  }

  get(key: Key, miss: () => Promise<Value>) {
    const cached = this.cache.get(key)

    if (cached) {
      if (cached.expiry > Date.now()) return Promise.resolve(cached.entry)

      this.cache.delete(key)
    }

    return miss().then((value) => {
      this.cache.set(key, { entry: value, expiry: Date.now() + this.ttl })
      return value
    })
  }
}
