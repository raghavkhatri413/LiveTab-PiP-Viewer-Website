import { defineConfig } from "vite";

export default defineConfig({
  base: "/",  // Adjust this based on deployment needs
  build: {
    outDir: "dist",
  },
  server: {
    port: 3000,
  },
});
