const defaultUrl = "https://api.dyte.io/v2/meetings";

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

export async function getOrCreateMeetingById(
  title: string,
  { url = defaultUrl, Authorization }: { url?: string; Authorization: string }
) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization,
    },
  };

  const updatedUrl = new URL(url);
  if (!updatedUrl.searchParams.has("search")) {
    updatedUrl.searchParams.set("search", title);
  }

  const response = await fetch(updatedUrl, options);
  const meeting = await response.json<MeetingApiResponse>();

  const result = meeting.data[0];

  if (result !== undefined) {
    return result;
  } else {
    const createdMeetingResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization,
      },
      body: JSON.stringify({
        title,
        preferred_region: "ap-south-1",
        record_on_start: false,
        live_stream_on_start: false,
        recording_config: {
          max_seconds: 60,
          file_name_prefix: "string",
          video_config: {
            codec: "H264",
            width: 1280,
            height: 720,
            watermark: {
              url: "http://example.com",
              size: { width: 1, height: 1 },
              position: "left top",
            },
            export_file: true,
          },
          audio_config: { codec: "AAC", channel: "stereo", export_file: true },
          storage_config: {
            type: "aws",
            access_key: "string",
            secret: "string",
            bucket: "string",
            region: "us-east-1",
            path: "string",
            auth_method: "KEY",
            username: "string",
            password: "string",
            host: "string",
            port: 0,
            private_key: "string",
          },
          dyte_bucket_config: { enabled: true },
        },
        ai_config: {
          transcription: {
            keywords: ["string"],
            language: "en-US",
            profanity_filter: false,
          },
          summarization: {
            word_limit: 500,
            text_format: "markdown",
            summary_type: "general",
          },
        },
        persist_chat: false,
        summarize_on_end: false,
      }),
    });
    const createdMeeting =
      await createdMeetingResponse.json<CreateMeetingApiResponse>();

    return createdMeeting.data;
  }
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

export async function createParticipantToken(
  meetingId: string,
  {
    url = defaultUrl,
    Authorization,
  }: {
    url?: string;
    Authorization: string;
  }
) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization,
    },
    body: JSON.stringify({
      name: "Mary Sue",
      picture: "https://i.imgur.com/test.jpg",
      preset_name: "group_call_host",
      custom_participant_id: "string",
    }),
  };

  const resolvedUrl = new URL(`${url}/${meetingId}/participants`);
  console.log(resolvedUrl);
  const response = await fetch(resolvedUrl, options);
  const data = await response.json<CreateParticipantResponse>();
  return data.data;
}
