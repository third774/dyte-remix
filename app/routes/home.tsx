import { getCookieSessionStorage } from "~/utils/session.server";
import type { Route } from "./+types/home";
import {
  data,
  Form,
  redirect,
  useActionData,
  useNavigation,
} from "react-router";
import { Button } from "~/ui/Button";
import { getCookie } from "~/utils/getCookie.server";
import { Input } from "~/ui/Input";
import { generateSlug } from "random-word-slugs";
import { useState } from "react";
import { createMeeting, getMeeting } from "~/utils/dyteApi.server";
import { isValidUUID } from "~/utils/isValidUuid";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dyte React Router Demo" }];
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
    if (typeof meetingName !== "string") {
      return new Response("meetingName missing or malformed", { status: 400 });
    }
    let meeting = await getMeeting(meetingName, {
      Authorization: context.cloudflare.env.DYTE_AUTH_HEADER,
      baseUrl: context.cloudflare.env.DYTE_BASE_URL,
    });
    if (!meeting) {
      meeting = await createMeeting(meetingName, {
        Authorization: context.cloudflare.env.DYTE_AUTH_HEADER,
        baseUrl: context.cloudflare.env.DYTE_BASE_URL,
      });
    }
    throw redirect(`/meeting/${meeting.id}`);
  }
  if (action === "join-meeting") {
    const meetingId = formData.get("meetingId");
    if (typeof meetingId !== "string") {
      return new Response("Missing meetingId", { status: 400 });
    }
    if (!isValidUUID(meetingId)) {
      return new Response("meetingId is not a valid uuid", { status: 400 });
    }

    const meeting = await getMeeting(meetingId, {
      Authorization: context.cloudflare.env.DYTE_AUTH_HEADER,
      baseUrl: context.cloudflare.env.DYTE_BASE_URL,
    });
    if (!meeting) {
      return data({
        meetingNotFound: true,
      });
    }
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
      Dyte React Router Demo
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
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
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
        <Button
          type="submit"
          variant="primary"
          className="whitespace-nowrap"
          autoFocus
          disabled={isNavigating}
          pending={isNavigating}
        >
          {isNavigating ? "Creating" : "Create Meeting"}
        </Button>
      </Form>
    </div>
  );
}

function JoinMeetingForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  console.log({ data });
  return (
    <Form method="post">
      <label
        htmlFor="meetingId"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Meeting ID
      </label>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <div>
          <Input id="meetingId" name="meetingId" required autoFocus />
          <input name="action" value="join-meeting" type="hidden" />
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={isNavigating}
          pending={isNavigating}
        >
          {isNavigating ? "Joining" : "Join Meeting"}
        </Button>
      </div>
    </Form>
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
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Input id="name" name="name" required autoFocus />
            <Button type="submit" variant="primary" className="w-full">
              {hasRedirectSearchParam ? "Continue to Meeting" : "Submit"}
            </Button>
          </div>
          <input type="hidden" name="action" value="set-name" />
          {redirectTo && (
            <input type="hidden" name="redirectTo" value={redirectTo} />
          )}
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
  const [mode, setMode] = useState<"join" | "create">("create");
  return (
    <>
      <UserHeader name={name} />
      <div className="space-y-4">
        {mode === "join" ? (
          <JoinMeetingForm />
        ) : (
          <CreateMeetingForm defaultMeetingName={newMeetingName} />
        )}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => setMode(mode === "join" ? "create" : "join")}
          >
            {mode === "join" ? "Create a meeting" : "Join a meeting"}
          </Button>
        </div>
      </div>
    </>
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
