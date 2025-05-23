declare namespace Cloudflare {
  interface Env {
    DYTE_AUTH_HEADER: string;
    DYTE_BASE_URL?: string;
    SESSION_SECRET?: string;
    MEETING_METADATA: KVNamespace;
    APP_NAME?: string;
  }
}
interface Env extends Cloudflare.Env {}
