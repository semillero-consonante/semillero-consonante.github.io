declare module "cloudflare:workers" {
  // El runtime de Cloudflare inyecta este objeto; el sitio estático no lo usa.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const env: any;
}

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

type D1Database = object;
