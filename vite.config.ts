import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/site/",
  clearScreen: false,
  plugins: [
    react(),
    {
      /**
       * DO NOT REMOVE
       * Chariot plugin
       * Logs client-side errors to the console to be passed to LLM
       * Adds reload endpoint so LLM can force full-reload for larger changes
       */
      name: "chariot",
      configureServer(server) {
        server.middlewares.use("/@chariot-logger", (req, res) => {
          let body = "";
          req.on("data", (chunk) => (body += chunk));
          req.on("end", () => {
            console.log("Client log:", body); // Logs to stdout
            res.statusCode = 200;
            res.end();
          });
        });
        server.middlewares.use("/@chariot-reload", (_req, res) => {
          server.ws.send({ type: "full-reload", path: "*" });
          res.end("Reload triggered");
        });
      },
    },
  ],
  /**
   * DO NOT REMOVE
   * Allow cors and all hosts in development + poll for file changes
   */
  server: {
    cors: true,
    allowedHosts: true,
    watch: {
      usePolling: true,
      interval: 500,
    },
  },
});
