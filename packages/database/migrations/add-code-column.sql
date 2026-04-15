-- Add code column to submissions table (nullable for backward compatibility)
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS code TEXT;
