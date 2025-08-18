// File path: vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
export default defineConfig({
    plugins: [
        react(),
        // Add the node polyfills plugin here
        nodePolyfills(),
    ],
});
