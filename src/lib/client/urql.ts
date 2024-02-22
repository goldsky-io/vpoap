import {
  type AnyVariables,
  type QueryArgs,
  queryStore,
  type OperationResultState,
} from '@urql/svelte'
import { derived, readable, writable } from 'svelte/store'

export function withInitialData<Data = unknown, Variables extends AnyVariables = AnyVariables>(
  queryArgs: QueryArgs<Data, Variables>,
  initialData?: Data,
) {
  if (!initialData) return queryStore(queryArgs)

  const fetched = writable(false)
  return derived([fetched, queryStore(queryArgs)], ([hasFetched, query]) => {
    if (query.data) {
      fetched.set(true)
    }

    return {
      ...query,
      data: hasFetched ? query.data : query.data || initialData,
    }
  })
}

export function withPolling<Data = unknown, Variables extends AnyVariables = AnyVariables>(
  queryArgs: QueryArgs<Data, Variables>,
  initialData?: Data,
) {
  const initial = withInitialData(queryArgs, initialData)
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
