// forcing dotenv to load here so that we can use server env vars
// sometimes vite doesn't load these in time
import 'dotenv/config'

// server side only env
export const POAP_API_KEY = process.env.POAP_API_KEY
export const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE
