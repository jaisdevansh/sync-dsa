import { pgTable, text, timestamp, integer, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  githubUsername: text('github_username').notNull().unique(),
  githubToken: text('github_token').notNull(),
  repoName: text('repo_name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  platform: text('platform').notNull(),
  title: text('title').notNull(),
  difficulty: text('difficulty').notNull(),
  language: text('language').notNull(),
  filePath: text('file_path').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const stats = pgTable('stats', {
  userId: integer('user_id').primaryKey(),
  totalSolved: integer('total_solved').default(0).notNull(),
  easyCount: integer('easy_count').default(0).notNull(),
  mediumCount: integer('medium_count').default(0).notNull(),
  hardCount: integer('hard_count').default(0).notNull(),
  leetcodeCount: integer('leetcode_count').default(0).notNull(),
  gfgCount: integer('gfg_count').default(0).notNull(),
  cnCount: integer('cn_count').default(0).notNull(),
  streak: integer('streak').default(0).notNull(),
  lastSolvedDate: timestamp('last_solved_date'),
});
