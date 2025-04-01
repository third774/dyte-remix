import type { AppLoadContext } from "react-router";
import { getCookieSessionStorage } from "./session.server";

export async function getName({
  request,
  context,
}: {
  request: Request;
  context: AppLoadContext;
}) {
  const storage = getCookieSessionStorage(context);
  const session = await storage.getSession(request.headers.get("Cookie"));
  const name = session.get("name");
  return name;
}
