declare namespace Cloudflare {
  interface Env {
    DYTE_AUTH_HEADER: string;
    DYTE_BASE_URL?: string;
    SESSION_SECRET?: string;
  }
}
interface Env extends Cloudflare.Env {}
