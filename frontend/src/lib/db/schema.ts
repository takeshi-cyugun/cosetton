import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  size: text('size'),
  category: text('category'),
  season: text('season'),
  status: text('status'),
  owner: text('owner'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;