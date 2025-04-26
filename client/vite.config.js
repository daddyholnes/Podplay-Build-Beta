import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Make sure to import 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'; // If you use this plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Options for node polyfills if needed
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      // Ensure this alias points correctly to your src directory
      '~': path.resolve(__dirname, './src'),
      '__vite-optional-peer-dep:react-redux:@reduxjs/toolkit': path.resolve(__dirname, 'node_modules/react-redux'),
      'react-redux': path.resolve(__dirname, 'node_modules/react-redux'),
    },
  },
  // ... other configurations like server, build, etc.
  server: {
    host: 'localhost',
    port: 3090, // Or your desired frontend port
    // Proxy API requests to the backend
    proxy: {
      '/api': {
        target: 'http://localhost:3080', // Your backend server address
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    // ... other build options
  },
});
