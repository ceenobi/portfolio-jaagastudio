import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";
import { WORKS } from "./app/lib/constants";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  async prerender() {
    const workPaths = WORKS.map(
      (work) => `/work/${work.title.split(" ").join("-").toLowerCase()}`,
    );
    return ["/", "/work", "/profile", "/contact", ...workPaths];
  },
  presets: [vercelPreset()],
} satisfies Config;
