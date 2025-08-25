/*
  # Add linked_components columns to missing tables

  1. Schema Updates
    - Add `linked_components` column to `monsters` table (jsonb array)
    - Add `linked_components` column to `governments` table (jsonb array) 
    - Add `linked_components` column to `geographical_features` table (jsonb array)
    - Add `linked_components` column to `sites` table (jsonb array)

  2. Notes
    - Using jsonb type to store array of component IDs
    - Default value is empty array '[]'::jsonb
    - Columns are nullable for flexibility
*/

-- Add linked_components to monsters table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'monsters' AND column_name = 'linked_components'
  ) THEN
    ALTER TABLE monsters ADD COLUMN linked_components jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add linked_components to governments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'governments' AND column_name = 'linked_components'
  ) THEN
    ALTER TABLE governments ADD COLUMN linked_components jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add linked_components to geographical_features table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'geographical_features' AND column_name = 'linked_components'
  ) THEN
    ALTER TABLE geographical_features ADD COLUMN linked_components jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add linked_components to sites table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sites' AND column_name = 'linked_components'
  ) THEN
    ALTER TABLE sites ADD COLUMN linked_components jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;