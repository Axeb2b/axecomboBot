import { table, integer, text, boolean, sql } from 'sdk/db';

export const users = table('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tgId: integer('tg_id').unique().notNull(),
  isAdmin: boolean('is_admin').default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  jobCount: integer('job_count').default(0),
});

export const jobs = table('jobs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull(),
  type: text('type').notNull(),
  operatorLabel: text('operator_label'),
  format: text('format').notNull(),
  status: text('status').notNull(),
  requested: integer('requested').notNull(),
  completed: integer('completed').default(0),
  error: text('error'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});
