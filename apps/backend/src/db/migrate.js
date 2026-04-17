import { createDb } from '@dsa-sync/database';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

export async function runMigrations() {
  const db = createDb(config.databaseUrl);
  
  try {
    logger.info('🔄 Running database migrations...');
    
    // Use raw SQL query instead of db.execute
    const { sql } = await import('drizzle-orm');
    
    // Add code column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE submissions 
      ADD COLUMN IF NOT EXISTS code TEXT;
    `);
    
    logger.info('✅ Migrations completed successfully');
  } catch (error) {
    logger.error('❌ Migration failed:', error.message);
    // Don't throw - let the app continue even if migration fails
  }
}
