import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { magicLink } from 'better-auth/plugins';

import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { sendEmail } from '$lib/server/email';
import {
  magicLinkTemplate,
  passwordResetTemplate,
  verifyEmailTemplate,
} from '$lib/server/email/templates';
import { hashPassword, verifyPassword } from './password';

function logLocalAuthLink(kind: string, email: string, url: string): void {
  if (env.NODE_ENV === 'production') {
    return;
  }

  console.info(`[auth:${kind}] ${email}: ${url}`);
}

export const auth = betterAuth({
  appName: 'The Trading Store',
  baseURL: env.BETTER_AUTH_URL || 'http://localhost:5173',
  secret: env.BETTER_AUTH_SECRET || 'local-development-secret-change-me',
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 12,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    sendResetPassword: async ({ user, url }) => {
      logLocalAuthLink('reset-password', user.email, url);
      await sendEmail({
        to: user.email,
        ...passwordResetTemplate(url),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      logLocalAuthLink('verify-email', user.email, url);
      await sendEmail({
        to: user.email,
        ...verifyEmailTemplate(url),
      });
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        logLocalAuthLink('magic-link', email, url);
        await sendEmail({
          to: email,
          ...magicLinkTemplate(url),
        });
      },
    }),
    sveltekitCookies(getRequestEvent),
  ],
});

export type AuthSession = typeof auth.$Infer.Session;
