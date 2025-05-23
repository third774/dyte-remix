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
import { getMeetingMetadata, type MeetingType } from "~/utils/meetingMetadata";

const presetMap = {
  meeting: {
    host: "group_call_host",
    participant: "group_call_participant",
  },
  webinar: {
    host: "webinar_presenter",
    participant: "webinar_viewer",
  },
} satisfies Record<MeetingType, { host: string; participant: string }>;

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data.meeting.title },
    {
      name: "description",
      content: "Join your video conference with Dyte and React Router",
    },
  ];
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const url = new URL(request.url);
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
    meeting = await createMeeting({ title: meetingId }, context);
  }
  if (meetingId !== meeting.id) {
    return redirect(`/meeting/${meeting.id}`);
  }

  const meetingMetadata = await getMeetingMetadata(meetingId, context);
  const hostToken = url.searchParams.get("hostToken");

  if (!userId) {
    userId = crypto.randomUUID();
  }

  const role =
    hostToken && meetingMetadata && hostToken === meetingMetadata.hostToken
      ? "host"
      : "participant";

  const meetingType = meetingMetadata?.type ?? "meeting";

  const participant = await createParticipantToken(
    {
      name,
      userId,
      meetingId: meeting.id,
      preset: presetMap[meetingType][role],
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
