import {
  createMeeting,
  createParticipantToken,
  getMeeting,
} from "~/utils/dyteApi.server";
import type { Route } from "./+types/meeting";
import { data, redirect } from "react-router";

import { useDyteClient } from "@dytesdk/react-web-core";
import DyteClient from "@dytesdk/web-core";
import { useEffect } from "react";
import { DyteMeeting } from "@dytesdk/react-ui-kit";
import { useNavigate } from "react-router";
import { getCookieSessionStorage } from "~/utils/session.server";
import { isValidUUID } from "~/utils/isValidUuid";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dyte Meeting Room" },
    {
      name: "description",
      content: "Join your video conference with Dyte and React Router",
    },
  ];
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const session = getCookieSessionStorage(context);
  const storage = await session.getSession(request.headers.get("Cookie"));
  const name: string | undefined = await storage.get("name");
  let userId: string | undefined = await storage.get("user-id");
  const { meetingId } = params;
  if (!meetingId || !isValidUUID(meetingId)) {
    return redirect("/");
  }

  if (!name) {
    return redirect(`/?redirectTo=/meeting/${meetingId}`);
  }

  let meeting = await getMeeting(meetingId, context);
  if (!meeting) {
    meeting = await createMeeting(meetingId, context);
  }
  if (meetingId !== meeting.id) {
    return redirect(`/meeting/${meeting.id}`);
  }

  if (!userId) {
    userId = crypto.randomUUID();
  }

  const participant = await createParticipantToken(
    {
      name,
      userId,
      meetingId: meeting.id,
    },
    context
  );
  const token = participant.token;

  return data(
    {
      meeting,
      token,
      dyteBaseUrl:
        context.cloudflare.env.DYTE_BASE_URL ?? "https://api.dyte.io/",
    },
    {
      headers: {
        "Set-Cookie": await session.commitSession(storage),
      },
    }
  );
}

export default function Meeting({ loaderData }: Route.ComponentProps) {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    const hostname = new URL(loaderData.dyteBaseUrl).hostname.replace(
      "api.",
      ""
    );
    initMeeting({
      baseURI: hostname,
      authToken: loaderData.token,
      defaults: {
        audio: false,
        video: false,
      },
    });
  }, [
    loaderData.token,
    loaderData.dyteBaseUrl,
    // initMeeting seems to change on every render, so we're excluding it for now
    // this should be fixed in @dytesdk/react-web-core, then we can uncomment
    // initMeeting
  ]);

  useNavigateOnLeave("/", meeting);

  return (
    <div className="h-full">
      <DyteMeeting showSetupScreen={false} meeting={meeting} />
    </div>
  );
}

function useNavigateOnLeave(to: string, meeting?: DyteClient) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!meeting) return;
    const handler = () => navigate(to);
    meeting.self.on("roomLeft", handler);
    return () => {
      meeting.self.off("roomLeft", handler);
    };
  }, [to, meeting]);
}
