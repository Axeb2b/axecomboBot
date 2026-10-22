import { table, integer, text } from 'sdk/db';

export const sessions = table('sessions', {
  chatId: integer('chat_id').primaryKey(),
  operator: text('operator').notNull(),
  prefix: text('prefix').notNull(),
});

export const operators = table('operators', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  prefix: text('prefix').notNull(),
});

export const users = table('users', {
  chatId: integer('chat_id').primaryKey(),
  firstName: text('first_name'),
  joinedAt: integer('joined_at'),
  totalCombos: integer('total_combos').default(0),
  totalFiles: integer('total_files').default(0),
});

export const adminState = table('admin_state', {
  chatId: integer('chat_id').primaryKey(),
  state: text('state').notNull(),
});
