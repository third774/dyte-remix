import type { AppLoadContext } from "react-router";

export interface MeetingMetadata {
  createdBy: string;
  hostToken: string;
}

export async function getMeetingMetadata(
  meetingId: string,
  context: AppLoadContext
) {
  const metadataAsString = await context.cloudflare.env.MEETING_METADATA.get(
    meetingId
  );
  return metadataAsString
    ? (JSON.parse(metadataAsString) as MeetingMetadata)
    : undefined;
}

export async function putMeetingMetadata(
  meetingId: string,
  meetingMetadata: MeetingMetadata,
  context: AppLoadContext
) {
  return context.cloudflare.env.MEETING_METADATA.put(
    meetingId,
    JSON.stringify(meetingMetadata)
  );
}
