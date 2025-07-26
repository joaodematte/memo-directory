import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

import { env } from '@/env';
import { db } from '@/server/db';
import { group } from '@/server/db/schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg'
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  },
  plugins: [nextCookies()],
  advanced: {
    database: {
      generateId: false
    },
    crossSubDomainCookies: {
      enabled: true,
      domain: '.memo.directory'
    }
  },
  trustedOrigins: ['https://memo.directory', 'https://app.memo.directory'],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await db.insert(group).values({
            name: env.DEFAULT_GROUP_NAME,
            color: env.DEFAULT_GROUP_COLOR,
            userId: user.id
          });
        }
      }
    }
  }
});
