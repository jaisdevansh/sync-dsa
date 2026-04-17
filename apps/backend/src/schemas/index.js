import { z } from 'zod';

export const submissionSchema = z.object({
  platform: z.enum(['leetcode', 'gfg', 'codingninjas']),
  title: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  language: z.string(),
  code: z.string().optional(),
  filePath: z.string(),
});

export const loginSchema = z.object({
  code: z.string().min(1),
});
