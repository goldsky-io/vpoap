// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  namespace NodeJS {
    interface ProcessEnv {
      // server side only environment variables
      POAP_API_KEY: string
      MAINTENANCE_MODE: string
    }
  }
}

export {}
