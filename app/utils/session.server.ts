import { createCookieSessionStorage, type AppLoadContext } from "react-router";

export const getCookieSessionStorage = (
  context: AppLoadContext,
  name: string = "__session"
) =>
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the same CookieOptions to create one
    cookie: {
      name,
      secrets: [
        context.cloudflare.env.SESSION_SECRET ?? "default_session_secret",
      ],
      sameSite: true,
      httpOnly: true,
    },
  });
