/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import * as path from "node:path";
import * as url from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "chrome136", // electron version target
    sourcemap: true,
    chunkSizeWarningLimit: 3000,
    emptyOutDir: true
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./")
    }
  },
  define: {
    // path-shorten dep use process in his source code. But it is not available in renderer
    "process.env.debug_path_shorten": "false"
  },
  server: {
    port: 9080
  }
});
