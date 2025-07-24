import { TRPCError } from '@trpc/server';
import { and, desc, eq } from 'drizzle-orm';
import z from 'zod';

import { getTitleFromURL } from '@/lib/url';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { bookmark } from '@/server/db/schema';

const createInput = z.object({
  type: z.enum(['url', 'text']),
  title: z.string().optional(),
  content: z.string(),
  groupId: z.string()
});

const updateInput = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  groupId: z.string()
});

const deleteInput = z.object({
  id: z.string()
});

const getAllByGroupInput = z.object({
  groupId: z.string()
});

export const bookmarkRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { type, content, groupId } = input;

      let query;

      if (type === 'text') {
        query = ctx.db
          .insert(bookmark)
          .values({
            type,
            content,
            groupId,
            userId
          })
          .returning();
      } else {
        const title = await getTitleFromURL(content);

        query = ctx.db
          .insert(bookmark)
          .values({
            type,
            title,
            content,
            groupId,
            userId
          })
          .returning();
      }

      const [created] = await query;

      if (!created) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }

      return created;
    }),
  update: protectedProcedure
    .input(updateInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id, title, content, groupId } = input;

      const exists = await ctx.db.query.bookmark.findFirst({
        where: and(eq(bookmark.id, id), eq(bookmark.userId, userId))
      });

      if (!exists) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const [updated] = await ctx.db
        .update(bookmark)
        .set({
          title,
          content,
          groupId
        })
        .where(eq(bookmark.id, id))
        .returning();

      if (!updated) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }

      return updated;
    }),
  delete: protectedProcedure
    .input(deleteInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id } = input;

      const exists = await ctx.db.query.bookmark.findFirst({
        where: and(eq(bookmark.userId, userId), eq(bookmark.id, id))
      });

      if (!exists) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }

      const [deleted] = await ctx.db
        .delete(bookmark)
        .where(eq(bookmark.id, id))
        .returning();

      return deleted;
    }),
  getAllByGroup: protectedProcedure
    .input(getAllByGroupInput)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const groupId = input.groupId;

      const data = await ctx.db.query.bookmark.findMany({
        orderBy: [desc(bookmark.createdAt)],
        where: and(eq(bookmark.userId, userId), eq(bookmark.groupId, groupId))
      });

      return data;
    })
});
