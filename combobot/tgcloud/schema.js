import { table, integer, text } from 'sdk/db';

export const sessions = table('sessions', {
  chatId: integer('chat_id').primaryKey(),
  operator: text('operator').notNull(),
  prefix: text('prefix').notNull(),
});
