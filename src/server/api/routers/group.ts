import { TRPCError } from '@trpc/server';
import { and, asc, eq } from 'drizzle-orm';
import z from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { group } from '@/server/db/schema';

const createInput = z.object({
  name: z.string(),
  color: z.string()
});

const deleteInput = z.object({
  id: z.string()
});

export const groupRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { name, color } = input;

      const [created] = await ctx.db
        .insert(group)
        .values({
          name,
          color,
          userId
        })
        .returning();

      if (!created) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }

      return created;
    }),
  delete: protectedProcedure
    .input(deleteInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id } = input;

      const exists = await ctx.db.query.group.findFirst({
        where: and(eq(group.userId, userId), eq(group.id, id))
      });

      if (!exists) {
        return new TRPCError({ code: 'NOT_FOUND' });
      }

      const [deleted] = await ctx.db
        .delete(group)
        .where(eq(group.id, id))
        .returning();

      return deleted;
    }),
  getAllByUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const data = await ctx.db.query.group.findMany({
      orderBy: [asc(group.createdAt)],
      where: eq(group.userId, userId)
    });

    return data;
  })
});
