import { getContextClient } from '@urql/svelte'
import type {
  POAPAccountWithTokens,
  POAPEventMetadata,
  POAPEventWithTokens,
  POAPTokenWithEvent,
} from '$lib/types/poap'
import { Cache } from './cache'
import { query } from './graphql'
import { fetchJson } from './json'
import { withInitialData, withPolling } from './urql'

const apiBasePath = '/api/poap'
const metadataCache = new Cache<string, POAPEventMetadata>()

export async function fetchPOAPMetadata(eventId: string) {
  return metadataCache.get(eventId, () =>
    fetchJson<POAPEventMetadata>([apiBasePath, eventId].join('/'), {
      method: 'POST',
    }),
  )
}

export interface FetchPOAPEventsVariables {
  ids: number[]
  first?: number
}

export interface FetchPOAPEventsData {
  events: POAPEventWithTokens[]
}

export function queryPOAPEvents(
  ids: FetchPOAPEventsVariables['ids'],
  first: FetchPOAPEventsVariables['first'],
  initialData?: FetchPOAPEventsData,
) {
  return withPolling<FetchPOAPEventsData, FetchPOAPEventsVariables>(
    {
      client: getContextClient(),
      query: query.events,
      variables: {
        ids,
        first,
      },
    },
    initialData,
  )
}

export interface FetchPOAPTokensVariables {
  first?: number
}

export interface FetchPOAPTokensData {
  tokens: POAPTokenWithEvent[]
}

export function queryPOAPTokens(
  first: FetchPOAPTokensVariables['first'],
  initialData?: FetchPOAPTokensData,
) {
  return withPolling<FetchPOAPTokensData, FetchPOAPTokensVariables>(
    {
      client: getContextClient(),
      query: query.tokens,
      variables: {
        first,
      },
    },
    initialData,
  )
}

export interface FetchPOAPTokenVariables {
  id: number
}

export interface FetchPOAPTokenData {
  token?: POAPTokenWithEvent | null
}

export function queryPOAPToken(
  id: FetchPOAPTokenVariables['id'],
  initialData?: FetchPOAPTokensData,
) {
  return withInitialData<FetchPOAPTokensData>(
    {
      client: getContextClient(),
      query: query.token,
      variables: {
        id,
      },
    },
    initialData,
  )
}

export interface FetchPOAPAccountVariables {
  address: string
  first?: number
}

export interface FetchPOAPAccountData {
  account?: POAPAccountWithTokens | null
}

export function queryPOAPAccount(
  address: FetchPOAPAccountVariables['address'],
  first: FetchPOAPAccountVariables['first'],
  initialData?: FetchPOAPAccountData,
) {
  return withPolling<FetchPOAPAccountData>(
    {
      client: getContextClient(),
      query: query.account,
      variables: {
        address: address.toLowerCase(),
        first,
      },
    },
    initialData,
  )
}
