import { Client, cacheExchange, fetchExchange, gql } from '@urql/core'
import type { Fetch } from './types'

export function createClient(fetch?: Fetch) {
  return new Client({
    url: '/api/graphql',
    exchanges: [cacheExchange, fetchExchange],
    fetch,
  })
}

const fragments = {
  event: gql`
    fragment EventFragment on Event {
      id
      created
      tokenMints
      tokenCount
      transferCount
    }
  `,
  token: gql`
    fragment TokenFragment on Token {
      id
      created
      mintOrder
      transferCount
      owner {
        id
        tokensOwned
      }
      transfers(first: 1, where: { from_: { id: "0x0000000000000000000000000000000000000000" } }) {
        id
        transaction
      }
    }
  `,
}

export const query = {
  events: gql`
    query EventsByIdQuery($ids: [ID!]!, $first: Int = 5) {
      events(where: { id_in: $ids }, orderBy: created, orderDirection: desc) {
        ...EventFragment
        tokens(first: $first, orderBy: created, orderDirection: desc) {
          ...TokenFragment
          event {
            id
          }
        }
      }
    }

    ${fragments.event}
    ${fragments.token}
  `,
  tokens: gql`
    query TokensQuery($first: Int = 5) {
      tokens(first: $first, orderBy: created, orderDirection: desc) {
        ...TokenFragment
        event {
          ...EventFragment
        }
      }
    }

    ${fragments.event}
    ${fragments.token}
  `,
  token: gql`
    query TokenQuery($id: ID!) {
      token(id: $id) {
        ...TokenFragment
        event {
          ...EventFragment
        }
      }
    }

    ${fragments.event}
    ${fragments.token}
  `,
  account: gql`
    query AccountQuery($address: String!, $first: Int = 5) {
      account(id: $address) {
        id
        tokens(first: $first, orderBy: created, orderDirection: desc) {
          ...TokenFragment
          event {
            ...EventFragment
          }
        }
      }
    }

    ${fragments.event}
    ${fragments.token}
  `,
}
