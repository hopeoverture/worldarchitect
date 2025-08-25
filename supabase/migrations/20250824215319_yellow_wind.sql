/*
  # Add linked_components column to characters table

  1. Changes
    - Add `linked_components` column to `characters` table
    - Column type: jsonb (to store array of UUIDs)
    - Default value: empty array
    - Nullable: true

  2. Security
    - No changes to RLS policies needed
    - Existing policies will cover the new column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'characters' AND column_name = 'linked_components'
  ) THEN
    ALTER TABLE characters ADD COLUMN linked_components jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;