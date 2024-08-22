import { error, json } from '@sveltejs/kit'
import { MAINTENANCE_MODE } from '$lib/server/env'
import { fetchPOAPMetadata, fetchPOAPMetadataBatch } from '$lib/server/poap'
import type { RequestHandler } from './$types'
import type {
  POAPAccountWithTokens,
  POAPEventMetadata,
  POAPEventWithTokens,
  POAPTokenWithEvent,
} from '$lib/types/poap'

type TokensQueryData = { tokens: POAPTokenWithEvent[] }
type EventsQueryData = { events: POAPEventWithTokens[] }
type AccountQueryData = { account: POAPAccountWithTokens }
type TokenQueryData = { token: POAPTokenWithEvent }
type QueryResult = { data: TokensQueryData | EventsQueryData | AccountQueryData | TokenQueryData }

export const POST: RequestHandler = async ({ request, fetch }) => {
  try {
    if (MAINTENANCE_MODE) throw error(503, 'Service Unavailable')

    const body = await request.text()
    const res = await fetch(
      'https://api.goldsky.com/api/public/project_clgolh2qx3hyt49x52bdk07j6/subgraphs/poap-xdai/1.0.0/gn',
      {
        method: 'POST',
        body,
        headers: {
          accept:
            'application/graphql-response+json, application/graphql+json, application/json, text/event-stream, multipart/mixed',
          'content-type': 'application/json',
        },
      },
    )
    const result = (await res.json()) as QueryResult
    const enriched = await enrichResult(result)

    return json(enriched)
  } catch (err) {
    console.error('error querying GraphQL', err)
    throw error(500, err instanceof Error ? err.message : 'GraphQL query error')
  }

  async function enrichResult(result: QueryResult) {
    if ('tokens' in result.data) {
      const [metadata, ens] = await Promise.all([
        fetchPOAPMetadataBatch(result.data.tokens, fetch),
        // fetchENSBatch(result.data.tokens),
        Promise.resolve(undefined),
      ])

      return {
        data: {
          ...result.data,
          metadata,
          ens,
        },
      }
    } else if ('events' in result.data) {
      const ids = Array.from(new Set(result.data.events.flatMap(({ id }) => Number(id))))
      const [metadata, ens] = await Promise.all([
        Promise.all(ids.map((id) => fetchPOAPMetadata(id, fetch))).then((metadata) =>
          Object.fromEntries(
            metadata
              .filter((item): item is POAPEventMetadata => Boolean(item))
              .map((metadata) => [metadata.id, metadata]),
          ),
        ),
        Promise.resolve(undefined),
      ])

      return {
        data: {
          ...result.data,
          metadata,
          ens,
        },
      }
    } else if ('account' in result.data) {
      const [metadata, ens] = await Promise.all([
        fetchPOAPMetadataBatch(result.data.account.tokens, fetch),
        Promise.resolve(undefined),
      ])

      return {
        data: {
          ...result.data,
          metadata,
          ens,
        },
      }
    } else if ('token' in result.data) {
      const id = Number(result.data.token.event.id)
      // const address = result.data.token.owner.id
      const [metadata, ens] = await Promise.all([
        fetchPOAPMetadata(id, fetch).then((metadata) => ({ [id]: metadata })),
        // fetchENS(address).then((ens) => ({ [address]: ens })),
        Promise.resolve(undefined),
      ])

      return {
        data: {
          ...result.data,
          metadata,
          ens,
        },
      }
    }

    // this should never happen
    return result
  }
}
