const defaultBaseUrl = "https://api.dyte.io/";

const meetingsPath = "v2/meetings";

interface MeetingApiResponse {
  success: boolean;
  data: DataItem[];
  paging: Paging;
}
export interface DataItem {
  id: string;
  title: string;
  preferred_region: string;
  created_at: string;
  record_on_start: boolean;
  updated_at: string;
  live_stream_on_start: boolean;
  persist_chat: boolean;
  summarize_on_end: boolean;
  status: string;
}
interface Paging {
  total_count: number;
  start_offset: number;
  end_offset: number;
}

interface CreateMeetingApiResponse {
  success: boolean;
  data: Data;
}
interface Data {
  id: string;
  title: string;
  preferred_region: string;
  created_at: string;
  record_on_start: boolean;
  updated_at: string;
  live_stream_on_start: boolean;
  persist_chat: boolean;
  summarize_on_end: boolean;
  status: string;
  recording_config: Recording_config;
  ai_config: Ai_config;
}
interface Recording_config {
  max_seconds: number;
  file_name_prefix: string;
  video_config: Video_config;
  audio_config: Audio_config;
  storage_config: Storage_config;
  dyte_bucket_config: Dyte_bucket_config;
  live_streaming_config: Live_streaming_config;
}
interface Video_config {
  codec: string;
  width: number;
  height: number;
  watermark: Watermark;
  export_file: boolean;
}
interface Watermark {
  url: string;
  size: Size;
  position: string;
}
interface Size {
  width: number;
  height: number;
}
interface Audio_config {
  codec: string;
  channel: string;
  export_file: boolean;
}
interface Storage_config {
  type: string;
  secret: string;
  bucket: string;
  region: string;
  path: string;
  auth_method: string;
  username: string;
  password: string;
  host: string;
  port: number;
  private_key: string;
}
interface Dyte_bucket_config {
  enabled: boolean;
}
interface Live_streaming_config {
  rtmp_url: string;
}
interface Ai_config {
  transcription: Transcription;
  summarization: Summarization;
}
interface Transcription {
  keywords: string[];
  language: string;
  profanity_filter: boolean;
}
interface Summarization {
  word_limit: number;
  text_format: string;
  summary_type: string;
}

export async function getMeeting(
  titleOrId: string,
  {
    baseUrl: baseUrl = defaultBaseUrl,
    Authorization,
  }: { baseUrl?: string; Authorization: string }
) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization,
    },
  };

  const updatedUrl = new URL(baseUrl + meetingsPath);
  if (!updatedUrl.searchParams.has("search")) {
    updatedUrl.searchParams.set("search", titleOrId);
  }

  const response = await fetch(updatedUrl, options);
  const meeting = await response.json<MeetingApiResponse>();

  const result = meeting.data[0];

  return result;
}

interface CreateParticipantResponse {
  success: boolean;
  data: CreateParticpantData;
}
export interface CreateParticpantData {
  id: string;
  name: string;
  picture: string;
  custom_participant_id: string;
  preset_name: string;
  created_at: string;
  updated_at: string;
  token: string;
}

export async function createMeeting(
  title: string,
  {
    baseUrl = defaultBaseUrl,
    Authorization,
  }: { baseUrl?: string; Authorization: string }
) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization,
    },
    body: JSON.stringify({ title }),
  };

  const response = await fetch(baseUrl + meetingsPath, options);
  const data = await response.json<CreateMeetingApiResponse>();
  return data.data;
}

export async function createParticipantToken({
  name,
  userId,
  meetingId,
  baseUrl = defaultBaseUrl,
  Authorization,
}: {
  name: string;
  baseUrl?: string;
  Authorization: string;
  meetingId: string;
  userId: string;
}) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization,
    },
    body: JSON.stringify({
      name,
      preset_name: "group_call_host",
      custom_participant_id: userId,
    }),
  };

  const resolvedUrl = new URL(
    `${baseUrl + meetingsPath}/${meetingId}/participants`
  );
  const response = await fetch(resolvedUrl, options);
  const data = await response.json<CreateParticipantResponse>();
  return data.data;
}
