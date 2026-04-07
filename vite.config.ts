import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    ssr: true,
    sourcemap: true,
    target: "esnext",
    minify: "esbuild",
    reportCompressedSize: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {},
    },
    outDir: "build",
    assetsDir: "assets",
  },
  esbuild: {
    target: "esnext",
  },
});
