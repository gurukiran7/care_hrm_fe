import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    federation({
      name: "care_hrm_fe",
      filename: "remoteEntry.js",
      exposes: {
        "./manifest": "./src/manifest.ts", 
      },
      shared: ["react", "react-dom"],

    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
})
