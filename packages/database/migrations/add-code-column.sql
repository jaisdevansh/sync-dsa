-- Add code column to submissions table
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS code TEXT NOT NULL DEFAULT '';

-- Update existing rows to have empty string (they won't have code anyway)
UPDATE submissions SET code = '' WHERE code IS NULL;
