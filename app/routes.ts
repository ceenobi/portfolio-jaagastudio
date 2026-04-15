import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("work", "routes/work.tsx"),
    route("work/:workId", "routes/workDetail.tsx"),
    route("profile", "routes/profile.tsx"),
    route("contact", "routes/contact.tsx"),
  ]),
] satisfies RouteConfig;
