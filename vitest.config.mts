import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        typecheck: {
            enabled: true,
        },
    },
    server: {
        open: true,
    }
  })