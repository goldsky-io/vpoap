import { createClient, query } from '$lib/client/graphql'
import { fetchJson } from '$lib/client/json'
import type {
  FetchPOAPAccountData,
  FetchPOAPAccountVariables,
  FetchPOAPEventsData,
  FetchPOAPEventsVariables,
  FetchPOAPTokenData,
  FetchPOAPTokenVariables,
  FetchPOAPTokensData,
  FetchPOAPTokensVariables,
} from '$lib/client/poap'
import type { Fetch } from '$lib/client/types'
import type { POAPEventMetadata } from '$lib/types/poap'
import { gql } from '@urql/svelte'
import { POAP_API_KEY } from './env'

// see https://documentation.poap.tech/ for api key
const baseUrl = 'https://api.poap.tech/events/id/'

export function fetchPOAPMetadata(eventId: number, fetch: Fetch) {
  const url = new URL(String(eventId), baseUrl).href
  return fetchJson<POAPEventMetadata>(url, {
    fetch,
    headers: {
      'X-API-Key': POAP_API_KEY,
    },
  })
}

export function fetchPOAPEvents(
  ids: FetchPOAPEventsVariables['ids'],
  first: FetchPOAPEventsVariables['first'],
  fetch: Fetch,
) {
  return createClient(fetch)
    .query<FetchPOAPEventsData, FetchPOAPEventsVariables>(query.events, { ids, first })
    .toPromise()
}

export function fetchPOAPTokens(first: FetchPOAPTokensVariables['first'], fetch: Fetch) {
  return createClient(fetch)
    .query<FetchPOAPTokensData, FetchPOAPTokensVariables>(query.tokens, { first })
    .toPromise()
}

export function fetchPOAPToken(id: FetchPOAPTokenVariables['id'], fetch: Fetch) {
  return createClient(fetch)
    .query<FetchPOAPTokenData, FetchPOAPTokenVariables>(query.token, { id })
    .toPromise()
}

export function fetchPOAPAccount(
  address: FetchPOAPAccountVariables['address'],
  first: FetchPOAPAccountVariables['first'],
  fetch: Fetch,
) {
  return createClient(fetch)
    .query<
      FetchPOAPAccountData,
      FetchPOAPAccountVariables
    >(query.account, { address: address.toLowerCase(), first })
    .toPromise()
}

export function fetchLatestEventPOAPTokens(eventIds: number[], fetch: Fetch) {
  return createClient(fetch)
    .query<{ events: { id: string; tokens: { id: string; created: string }[] }[] }>(
      gql`
        query LatestEventToken($eventIds: [ID!]!) {
          events(where: { id_in: $eventIds }, orderBy: created, orderDirection: desc) {
            id
            tokens(first: 1, orderBy: created, orderDirection: desc) {
              id
              created
            }
          }
        }
      `,
      { eventIds },
    )
    .toPromise()
}

export function fetchLatestAccountPOAPToken(address: string, fetch: Fetch) {
  return createClient(fetch)
    .query<{ account: { id: string; tokens: { id: string }[] } | null | undefined }>(
      gql`
        query LatestEventToken($address: String!) {
          account(id: $address) {
            id
            tokens(first: 1, orderBy: created, orderDirection: desc) {
              id
            }
          }
        }
      `,
      { address: address.toLowerCase() },
    )
    .toPromise()
}
