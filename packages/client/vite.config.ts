import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            "/trpc": "http://localhost:3000/",
        },
    },
    plugins: [
        tsconfigPaths(),
        react(),
        vanillaExtractPlugin(),
        splitVendorChunkPlugin(),
    ],
});
