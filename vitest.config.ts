import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    coverage: {
      exclude: ['node_modules/', '.next/', '**/*.config.*', '**/*.d.ts'],
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    css: true,
    environment: 'jsdom',
    exclude: ['node_modules', '.next', 'e2e'],
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
