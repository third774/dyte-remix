import type { AppLoadContext } from "react-router";

export const validMeetingTypes = ["meeting", "webinar"] as const;

export type MeetingType = (typeof validMeetingTypes)[number];

export function isValidMeetingType(value: unknown): value is MeetingType {
  return validMeetingTypes.includes(value as any);
}

export interface MeetingMetadata {
  createdBy: string;
  hostToken: string;
  type: MeetingType;
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
