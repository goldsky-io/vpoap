import { Client, cacheExchange, fetchExchange, setContextClient } from '@urql/svelte'

export function initializeGraphQL() {
  setContextClient(
    new Client({
      url: 'https://api.goldsky.com/api/public/project_clgolh2qx3hyt49x52bdk07j6/subgraphs/poap-xdai/1.0.0/gn',
      fetchSubscriptions: true,
      exchanges: [cacheExchange, fetchExchange],
    }),
  )
}
