export interface POAPAccount {
  id: string
  tokensOwned: string
}

export interface POAPToken {
  id: string
  created: string
  mintOrder: string
  transferCount: string
  owner: POAPAccount
  event: {
    id: string
  }
}

export interface POAPTokenWithEvent extends POAPToken {
  event: POAPEvent
}

export interface POAPEvent {
  id: string
  created: string
  tokenMints: string
  tokenCount: string
  transferCount: string
}

export interface POAPEventWithTokens extends POAPEvent {
  tokens: POAPToken[]
}

export interface POAPAccountWithTokens {
  id: string
  tokens: POAPTokenWithEvent[]
}

export interface POAPEventMetadata {
  id: number
  // fancy_id: string
  name: string
  description: string
  // location_type: string
  city: string
  country: string
  // channel: string
  // platform: string
  event_url: string
  image_url: string
  // animation_url: string
  // year: number
  // start_date: string
  // end_date: string
  // expiry_date: string
  // timezone: string
  // from_admin: boolean
  virtual_event: boolean
  // event_template_id: null
  // private_event: boolean
}
