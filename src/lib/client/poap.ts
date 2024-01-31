import { getContextClient, gql } from '@urql/svelte'
import type { POAPEventMetadata, POAPEventWithTokens, POAPTokenWithEvent } from '$lib/types/poap'
import { Cache } from './cache'
import { fetchJson } from './json'
import { withPolling } from './urql'

const apiBasePath = '/api/poap'
const metadataCache = new Cache<string, POAPEventMetadata>()

export async function fetchPOAPMetadata(eventId: string) {
  return metadataCache.get(eventId, () =>
    fetchJson<POAPEventMetadata>([apiBasePath, eventId].join('/'), {
      method: 'POST',
    }),
  )
}

interface FetchPOAPEventsVariables {
  ids: number[]
}

interface FetchPOAPEventsData {
  events: POAPEventWithTokens[]
}

export function queryPOAPEvents(ids: FetchPOAPEventsVariables['ids']) {
  return withPolling<FetchPOAPEventsData, FetchPOAPEventsVariables>({
    client: getContextClient(),
    query: gql`
      query EventsByIdQuery($ids: [ID!]!, $first: Int = 5) {
        events(where: { id_in: $ids }, orderBy: created, orderDirection: desc) {
          id
          created
          tokenMints
          tokenCount
          transferCount
          tokens(first: $first, orderBy: created, orderDirection: desc) {
            id
            created
            mintOrder
            transferCount
            owner {
              id
              tokensOwned
            }
            event {
              id
            }
          }
        }
      }
    `,
    variables: {
      ids,
    },
  })
}

interface FetchPOAPTokensVariables {
  first?: number
}

interface FetchPOAPTokensData {
  tokens: POAPTokenWithEvent[]
}

export function queryPOAPTokens(first?: number) {
  return withPolling<FetchPOAPTokensData, FetchPOAPTokensVariables>({
    client: getContextClient(),
    query: gql`
      query TokensQuery($first: Int = 5) {
        tokens(first: $first, orderBy: created, orderDirection: desc) {
          id
          created
          mintOrder
          transferCount
          owner {
            id
            tokensOwned
          }
          event {
            id
            created
            tokenMints
            tokenCount
            transferCount
          }
        }
      }
    `,
    variables: {
      first,
    },
  })
}
