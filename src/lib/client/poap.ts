import { getContextClient, queryStore } from '@urql/svelte'
import type { POAPEventMetadata, POAPEventWithTokens, POAPTokenWithEvent } from '$lib/types/poap'
import { Cache } from './cache'
import { query } from './graphql'
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
    query: query.events,
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

export function queryPOAPTokens(first: FetchPOAPTokensVariables['first']) {
  return withPolling<FetchPOAPTokensData, FetchPOAPTokensVariables>({
    client: getContextClient(),
    query: query.tokens,
    variables: {
      first,
    },
  })
}

export interface FetchPOAPTokenVariables {
  id: number
}

export interface FetchPOAPTokenData {
  token: POAPTokenWithEvent
}

export function queryPOAPToken(id: FetchPOAPTokenVariables['id']) {
  return queryStore<FetchPOAPTokensData>({
    client: getContextClient(),
    query: query.token,
    variables: {
      id,
    },
  })
}
