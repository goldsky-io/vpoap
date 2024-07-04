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
import type { POAPEventMetadata, POAPTokenWithEvent } from '$lib/types/poap'
import { gql } from '@urql/svelte'
import { POAP_API_KEY } from './env'
import { cacheFetch } from './cache'

// see https://documentation.poap.tech/ for api key
const baseUrl = 'https://api.poap.tech/events/id/'

export async function fetchPOAPMetadata(eventId: number, fetch: Fetch) {
  return await cacheFetch('metadata', String(eventId), async () => {
    const url = new URL(String(eventId), baseUrl).href
    const { id, name, description, city, country, event_url, image_url, virtual_event } =
      await fetchJson<POAPEventMetadata>(url, {
        fetch,
        headers: {
          'X-API-Key': POAP_API_KEY,
        },
      })

    return { id, name, description, city, country, event_url, image_url, virtual_event }
  })
}

export async function fetchPOAPMetadataBatch(
  tokens: POAPTokenWithEvent[] | undefined,
  fetch: Fetch,
): Promise<Record<number, POAPEventMetadata>> {
  if (!tokens) return {}

  const ids = Array.from(new Set(tokens.map((token) => Number(token.event.id))))
  const entries = await Promise.all(
    ids.map((id) => fetchPOAPMetadata(id, fetch).then((metadata) => [id, metadata] as const)),
  )

  return Object.fromEntries(
    entries.filter((entry): entry is [number, POAPEventMetadata] => Boolean(entry[1])),
  )
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

export function fetchLatestPOAPToken(fetch: Fetch) {
  return createClient(fetch)
    .query<{ tokens: { id: string }[] }>(
      gql`
        query LatestToken {
          tokens(first: 1, orderBy: created, orderDirection: desc) {
            id
          }
        }
      `,
      {},
    )
    .toPromise()
}
