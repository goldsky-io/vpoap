import { getContextClient, gql } from '@urql/svelte'
import type { POAPEventMetadata, POAPEventWithTokens, POAPTokenWithEvent } from '$lib/types/poap'
import { fetchJson } from './json'
import { withPolling } from './urql'

const apiBasePath = '/api/poap'

export function fetchPOAPMetadata(eventId: string) {
  return fetchJson<POAPEventMetadata>([apiBasePath, eventId].join('/'), { method: 'POST' })
}

interface FetchPOAPEventsVariables {
  id: number
}

interface FetchPOAPEventsData {
  event: POAPEventWithTokens
}

export function queryPOAPEvent(id: FetchPOAPEventsVariables['id']) {
  return withPolling<FetchPOAPEventsData, FetchPOAPEventsVariables>({
    client: getContextClient(),
    query: gql`
      query EventByIdQuery($id: ID!) {
        event(id: $id) {
          id
          created
          tokenMints
          tokenCount
          transferCount
          tokens(orderBy: mintOrder, orderDirection: desc) {
            id
            created
            mintOrder
            transferCount
            owner {
              id
              tokensOwned
            }
          }
        }
      }
    `,
    variables: {
      id,
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
