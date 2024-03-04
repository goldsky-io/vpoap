export const MaxItems = 10
export const DevBaseUrl = 'http://localhost:5173'
export const ProdBaseUrl = 'https://feed.poap.demo.goldsky.com/'
export const BaseUrl = import.meta.env.DEV ? DevBaseUrl : ProdBaseUrl
