import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  use: {
    baseURL: 'http://localhost:4173',
  },
  webServer: {
    command:
      'BETTER_AUTH_URL=http://localhost:4173 PUBLIC_APP_URL=http://localhost:4173 pnpm db:migrate && pnpm db:seed && BETTER_AUTH_URL=http://localhost:4173 PUBLIC_APP_URL=http://localhost:4173 pnpm exec vite dev --host 0.0.0.0 --port 4173',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  testMatch: '**/*.e2e.{ts,js}',
});
