import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/meeting/:meetingName?", "routes/meeting.tsx"),
] satisfies RouteConfig;
