import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: validated at runtime by drizzle-kit
    url: process.env.DATABASE_URL!,
  },
  dialect: 'postgresql',
  out: './drizzle',
  schema: './src/db/schema/index.ts',
});
