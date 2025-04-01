import type { AppLoadContext } from "react-router";
import { getCookieSessionStorage } from "./session.server";

export async function getCookie(
  name: string,
  {
    request,
    context,
  }: {
    request: Request;
    context: AppLoadContext;
  }
): Promise<string | undefined> {
  const storage = getCookieSessionStorage(context);
  const session = await storage.getSession(request.headers.get("Cookie"));
  return session.get(name);
}
