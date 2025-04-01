import { getCookieSessionStorage } from "~/utils/session.server";
import type { Route } from "./+types/home";
import { Form, redirect } from "react-router";
import { getName } from "~/utils/getName.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dyte Remix Demo" }];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const name = await getName({ context, request });
  return { name };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");
  if (
    typeof action !== "string" ||
    !["remove-name", "set-name"].includes(action)
  ) {
    return new Response("Invalid action", { status: 400 });
  }
  if (action === "set-name") {
    const username = formData.get("name");
    const storage = getCookieSessionStorage(context);
    storage.commitSession;
    const session = await storage.getSession(request.headers.get("Cookie"));
    session.set("name", username);
    throw redirect("/", {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    });
  } else if (action === "remove-name") {
    const storage = getCookieSessionStorage(context);
    const session = await storage.getSession(request.headers.get("Cookie"));
    session.unset("name");
    throw redirect("/", {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    });
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { name } = loaderData;
  return (
    <div className="h-full">
      {name ? (
        <>
          <div>
            Hello, {name}!{" "}
            <Form method="post">
              <input type="hidden" name="action" value="remove-name" />
              <button type="submit">Change Name</button>
            </Form>
          </div>
        </>
      ) : (
        <></>
      )}
      <Form method="post">
        <label htmlFor="name">Name</label>
        <input type="hidden" name="action" value="set-name" />
        <input id="name" name="name" />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
