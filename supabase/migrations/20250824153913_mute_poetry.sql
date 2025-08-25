/*
  # Add World Configuration Columns

  1. New Columns
    - `authority_structure` (text array) - Stores multiple authority structure types
    - `daily_life_pressures` (text array) - Stores multiple daily life pressure types
    - `tone` (text) - World tone setting
    - `magic_level` (text) - Magic level setting
    - `tech_level` (text) - Technology level setting
    - `general_description_style` (text) - AI generation context

  2. Changes
    - Add missing columns to worlds table with appropriate defaults
    - All columns are nullable to maintain compatibility with existing data
*/

-- Add missing columns to worlds table
DO $$
BEGIN
  -- Add authority_structure column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'worlds' AND column_name = 'authority_structure'
  ) THEN
    ALTER TABLE worlds ADD COLUMN authority_structure text[] DEFAULT '{}';
  END IF;

  -- Add daily_life_pressures column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'worlds' AND column_name = 'daily_life_pressures'
  ) THEN
    ALTER TABLE worlds ADD COLUMN daily_life_pressures text[] DEFAULT '{}';
  END IF;

  -- Add tone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'worlds' AND column_name = 'tone'
  ) THEN
    ALTER TABLE worlds ADD COLUMN tone text;
  END IF;

  -- Add magic_level column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'worlds' AND column_name = 'magic_level'
  ) THEN
    ALTER TABLE worlds ADD COLUMN magic_level text;
  END IF;

  -- Add tech_level column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'worlds' AND column_name = 'tech_level'
  ) THEN
    ALTER TABLE worlds ADD COLUMN tech_level text;
  END IF;

  -- Add general_description_style column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'worlds' AND column_name = 'general_description_style'
  ) THEN
    ALTER TABLE worlds ADD COLUMN general_description_style text;
  END IF;
END $$;