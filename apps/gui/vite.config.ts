import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import aliases from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [aliases(), react()],
  envPrefix: "SUBSTREAMS_",
});
