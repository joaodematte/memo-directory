import type { inferProcedureOutput } from '@trpc/server';

import type { AppRouter } from '@/server/api/root';

export type Group = inferProcedureOutput<
  AppRouter['group']['getAllByUser']
>[number];

export type Bookmark = inferProcedureOutput<
  AppRouter['bookmark']['getAllByGroup']
>[number];
