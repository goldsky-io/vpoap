import {
  type AnyVariables,
  type QueryArgs,
  queryStore,
  type OperationResultState,
} from '@urql/svelte'
import { derived, readable, writable } from 'svelte/store'

export function withPolling<Data = unknown, Variables extends AnyVariables = AnyVariables>(
  queryArgs: QueryArgs<Data, Variables>,
) {
  const initial = queryStore(queryArgs)
  const result = writable<OperationResultState<Data, Variables>>()
  const query = derived([initial, result], ([initial, next]) => {
    return next || initial
  })

  return {
    ...query,
    refresh,
    poll,
  }

  function refresh() {
    return new Promise<Data>((resolve, reject) => {
      queryStore<Data, Variables>({ ...queryArgs, requestPolicy: 'network-only' }).subscribe(
        ($data) => {
          result.set($data)

          if ($data.error) {
            reject($data.error)
          } else if ($data.data) {
            resolve($data.data)
          }
        },
      )
    })
  }

  function poll(intervalMs = 5_000) {
    const lastUpdated = readable(new Date(), (set) => {
      const timeout = setInterval(interval, intervalMs)

      return () => {
        clearInterval(timeout)
      }

      function interval() {
        refresh().catch(console.error)
        set(new Date())
      }
    })

    const polling = derived([query, lastUpdated], ([query, lastUpdated]) => ({
      ...query,
      lastUpdated,
    }))

    return {
      ...polling,
      refresh,
    }
  }
}
