import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['test/**/*', '**/*.test.ts', '**/*.spec.ts']
    },
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})