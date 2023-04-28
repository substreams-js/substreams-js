import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import aliases from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    aliases({
      root: "../../",
    }),
    react(),
  ],
});
