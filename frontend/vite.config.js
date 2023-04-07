import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      react({
        // Add this line
        include: "**/*.jsx",
      }),
      svgr({
        svgrOptions: {
          // svgr options
        },
      }),
    ],
    server: {
      port: env.VITE_PORT,
    },
  };
});
