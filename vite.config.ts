// File: vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Add the node polyfills plugin to handle Node.js global variables and modules
    // This is crucial for web3 libraries like ethers, WalletConnect, etc.
    nodePolyfills({
      // To exclude specific polyfills, add them to this array.
      // For example, if you don't want to polyfill `fs`, add 'fs' to this array.
      exclude: [],
      // Whether to polyfill `global`.
      globals: {
        Buffer: true, // Provide a Buffer polyfill
        global: true,
        process: true,
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      // If you have path aliases, define them here
      // Example: '@': path.resolve(__dirname, './src'),
    }
  }
});