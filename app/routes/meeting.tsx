import { createParticipantToken, getOrCreateMeetingById } from "~/dyteApi";
import type { Route } from "./+types/meeting";
import { redirect } from "react-router";

import { DyteMeeting } from "@dytesdk/react-ui-kit";
import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context, params }: Route.LoaderArgs) {
  const { meetingName } = params;
  const meeting = await getOrCreateMeetingById(meetingName, {
    Authorization: context.cloudflare.env.DYTE_AUTH_HEADER,
  });
  if (meetingName !== meeting.id) {
    return redirect(`/meeting/${meeting.id}`);
  }
  const participant = await createParticipantToken(meeting.id, {
    Authorization: context.cloudflare.env.DYTE_AUTH_HEADER,
  });

  return { meeting, participant };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    initMeeting({
      authToken: loaderData.participant.token,
      defaults: {
        audio: false,
        video: false,
      },
    });
  }, []);

  return (
    <DyteProvider value={meeting}>
      <DyteMeeting mode="fill" meeting={meeting} showSetupScreen={false} />
    </DyteProvider>
  );
}
