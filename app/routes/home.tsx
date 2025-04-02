import { getCookieSessionStorage } from "~/utils/session.server";
import type { Route } from "./+types/home";
import { Form, redirect } from "react-router";
import { Button } from "~/ui/Button";
import { getCookie } from "~/utils/getCookie.server";
import { Input } from "~/ui/Input";
import { generateSlug } from "random-word-slugs";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dyte Remix Demo" }];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo");
  return {
    name: await getCookie("name", { context, request }),
    newMeetingName: generateSlug(),
    redirectTo,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");
  const redirectTo = formData.get("redirectTo");

  if (
    typeof action !== "string" ||
    !["remove-name", "set-name", "join-meeting", "create-meeting"].includes(
      action
    )
  ) {
    return new Response("Invalid action", { status: 400 });
  }
  if (action === "create-meeting") {
    const meetingName = formData.get("meetingName");
    throw redirect(`/meeting/${meetingName}`);
  }
  if (action === "join-meeting") {
    const meetingId = formData.get("meetingId");
    throw redirect(`/meeting/${meetingId}`);
  } else if (action === "set-name") {
    const username = formData.get("name");
    const storage = getCookieSessionStorage(context);
    storage.commitSession;
    const session = await storage.getSession(request.headers.get("Cookie"));
    session.set("name", username);

    if (typeof redirectTo === "string" && redirectTo) {
      throw redirect(redirectTo, {
        headers: {
          "Set-Cookie": await storage.commitSession(session),
        },
      });
    }

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

function Header() {
  return (
    <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
      Dyte Remix Demo
    </h1>
  );
}

function UserHeader({ name }: { name: string }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <p className="text-lg font-medium text-gray-800 dark:text-white">
        Hello, <span className="font-bold">{name}</span>!
      </p>
      <Form method="post">
        <input type="hidden" name="action" value="remove-name" />
        <Button type="submit" variant="ghost" size="sm">
          Change Name
        </Button>
      </Form>
    </div>
  );
}

function CreateMeetingForm({
  defaultMeetingName,
}: {
  defaultMeetingName: string;
}) {
  return (
    <div>
      <label
        htmlFor="meetingName"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Meeting Name
      </label>
      <Form method="post" className="grid grid-cols-[1fr_auto] gap-2">
        <Input
          id="meetingName"
          name="meetingName"
          defaultValue={defaultMeetingName}
        />
        <input type="hidden" name="action" value="create-meeting" />
        <Button type="submit" variant="primary" className="whitespace-nowrap" autoFocus>
          Create Meeting
        </Button>
      </Form>
    </div>
  );
}

function JoinMeetingForm() {
  return (
    <details className="w-full">
      <summary className="cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
        Or join a meeting
      </summary>
      <Form method="post" className="mt-4">
        <div className="space-y-3">
          <div>
            <label
              htmlFor="meetingId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Meeting ID
            </label>
            <Input id="meetingId" name="meetingId" required />
            <input name="action" value="join-meeting" type="hidden" />
          </div>
          <Button type="submit" variant="secondary" className="w-full">
            Join Meeting
          </Button>
        </div>
      </Form>
    </details>
  );
}

function NameForm({ redirectTo }: { redirectTo?: string | null }) {
  const hasRedirectSearchParam = Boolean(redirectTo);

  return (
    <>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        What is your name?
      </p>
      <Form method="post" className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Name
          </label>
          <input type="hidden" name="action" value="set-name" />
          {redirectTo && (
            <input type="hidden" name="redirectTo" value={redirectTo} />
          )}
          <Input id="name" name="name" required autoFocus />
        </div>
        <div className="pt-2">
          <Button type="submit" variant="primary" className="w-full">
            {hasRedirectSearchParam ? "Continue to Meeting" : "Submit"}
          </Button>
        </div>
      </Form>
    </>
  );
}

function MeetingActions({
  name,
  newMeetingName,
}: {
  name: string;
  newMeetingName: string;
}) {
  return (
    <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
      <UserHeader name={name} />
      <div className="space-y-4">
        <CreateMeetingForm defaultMeetingName={newMeetingName} />
        <JoinMeetingForm />
      </div>
    </div>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { name, newMeetingName, redirectTo } = loaderData;
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <Header />
        {name ? (
          <MeetingActions name={name} newMeetingName={newMeetingName} />
        ) : (
          <NameForm redirectTo={redirectTo} />
        )}
      </div>
    </div>
  );
}
