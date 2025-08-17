import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import federation from "@originjs/vite-plugin-federation";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),   tailwindcss(),   federation({
    name: "care_hrm_fe",
    filename: "remoteEntry.js",
    exposes: {
      "./manifest": "./src/manifest.tsx", 
    },
    shared: ["react", "react-dom"],
    

  }),],
  
})
