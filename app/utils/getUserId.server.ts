import { getCookie } from "./getCookie.server";
import type { AppLoadContext } from "react-router";
import { redirect } from "react-router";

export async function getUserId(params: {
  request: Request;
  context: AppLoadContext;
}) {
  const userId = await getCookie("user-id", params);
  if (!userId) {
    throw redirect("/");
  }
  return userId;
}
