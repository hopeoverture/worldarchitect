/*
  # World Architect Database Schema

  1. New Tables
    - `worlds` - Main world container for all components
    - `regions` - Geographic regions with terrain types
    - `governments` - Political structures and leadership
    - `geographical_features` - Natural landmarks and features
    - `sites` - Buildings, shops, landmarks within settlements
    - `adventures` - Quests and storylines with objectives
    - `characters` - NPCs and important figures
    - `history` - Historical events and eras
    - `monsters` - Creatures and beasts
    - `items` - Equipment, artifacts, and treasures
    - `settlements` - Cities, towns, villages

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own worlds
    - Users can only access components from worlds they own

  3. Relationships
    - All components link to a world via world_id
    - Components can link to each other via foreign keys
    - Many-to-many relationships handled via JSON arrays for flexibility
*/

-- Create worlds table
CREATE TABLE IF NOT EXISTS worlds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create regions table
CREATE TABLE IF NOT EXISTS regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  primary_terrain text NOT NULL CHECK (primary_terrain IN ('forest', 'mountain', 'desert', 'plains', 'swamp', 'tundra', 'coast', 'island')),
  linked_components jsonb DEFAULT '[]'::jsonb,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create governments table
CREATE TABLE IF NOT EXISTS governments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  government_type text NOT NULL CHECK (government_type IN ('monarchy', 'democracy', 'oligarchy', 'theocracy', 'dictatorship', 'tribal', 'federation', 'empire')),
  linked_region uuid REFERENCES regions(id) ON DELETE SET NULL,
  leadership text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create geographical_features table
CREATE TABLE IF NOT EXISTS geographical_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  feature_type text NOT NULL CHECK (feature_type IN ('forest', 'mountain', 'river', 'lake', 'ocean', 'canyon', 'cave', 'volcano', 'glacier')),
  linked_region uuid REFERENCES regions(id) ON DELETE SET NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create settlements table
CREATE TABLE IF NOT EXISTS settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  settlement_type text NOT NULL CHECK (settlement_type IN ('village', 'town', 'city', 'capital', 'outpost', 'fortress', 'trading_post')),
  population integer DEFAULT 0,
  linked_region uuid REFERENCES regions(id) ON DELETE SET NULL,
  linked_government uuid REFERENCES governments(id) ON DELETE SET NULL,
  description text DEFAULT '',
  notable_features text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sites table
CREATE TABLE IF NOT EXISTS sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  site_type text NOT NULL CHECK (site_type IN ('shop', 'tavern', 'temple', 'library', 'fortress', 'ruins', 'landmark', 'dungeon')),
  linked_settlement uuid REFERENCES settlements(id) ON DELETE SET NULL,
  linked_region uuid REFERENCES regions(id) ON DELETE SET NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  race text DEFAULT '',
  class_profession text DEFAULT '',
  alignment text CHECK (alignment IN ('lawful_good', 'neutral_good', 'chaotic_good', 'lawful_neutral', 'true_neutral', 'chaotic_neutral', 'lawful_evil', 'neutral_evil', 'chaotic_evil')),
  linked_settlement uuid REFERENCES settlements(id) ON DELETE SET NULL,
  role text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create adventures table
CREATE TABLE IF NOT EXISTS adventures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'epic')),
  linked_components jsonb DEFAULT '[]'::jsonb,
  description text DEFAULT '',
  objectives text DEFAULT '',
  rewards text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create history table
CREATE TABLE IF NOT EXISTS history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  era text DEFAULT '',
  linked_components jsonb DEFAULT '[]'::jsonb,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create monsters table
CREATE TABLE IF NOT EXISTS monsters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  monster_type text NOT NULL CHECK (monster_type IN ('beast', 'humanoid', 'undead', 'dragon', 'fiend', 'celestial', 'fey', 'elemental', 'aberration')),
  challenge_rating text DEFAULT '1',
  habitat text DEFAULT '',
  linked_region uuid REFERENCES regions(id) ON DELETE SET NULL,
  description text DEFAULT '',
  abilities text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('weapon', 'armor', 'accessory', 'consumable', 'tool', 'treasure', 'artifact', 'mundane')),
  rarity text NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'very_rare', 'legendary', 'artifact')),
  linked_character uuid REFERENCES characters(id) ON DELETE SET NULL,
  linked_site uuid REFERENCES sites(id) ON DELETE SET NULL,
  description text DEFAULT '',
  properties text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_worlds_user_id ON worlds(user_id);
CREATE INDEX IF NOT EXISTS idx_regions_world_id ON regions(world_id);
CREATE INDEX IF NOT EXISTS idx_governments_world_id ON governments(world_id);
CREATE INDEX IF NOT EXISTS idx_geographical_features_world_id ON geographical_features(world_id);
CREATE INDEX IF NOT EXISTS idx_settlements_world_id ON settlements(world_id);
CREATE INDEX IF NOT EXISTS idx_sites_world_id ON sites(world_id);
CREATE INDEX IF NOT EXISTS idx_characters_world_id ON characters(world_id);
CREATE INDEX IF NOT EXISTS idx_adventures_world_id ON adventures(world_id);
CREATE INDEX IF NOT EXISTS idx_history_world_id ON history(world_id);
CREATE INDEX IF NOT EXISTS idx_monsters_world_id ON monsters(world_id);
CREATE INDEX IF NOT EXISTS idx_items_world_id ON items(world_id);

-- Enable Row Level Security on all tables
ALTER TABLE worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE governments ENABLE ROW LEVEL SECURITY;
ALTER TABLE geographical_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE adventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE monsters ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for worlds
CREATE POLICY "Users can view their own worlds"
  ON worlds
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own worlds"
  ON worlds
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own worlds"
  ON worlds
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own worlds"
  ON worlds
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for regions
CREATE POLICY "Users can view regions from their worlds"
  ON regions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM worlds 
      WHERE worlds.id = regions.world_id 
      AND worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create regions in their worlds"
  ON regions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM worlds 
      WHERE worlds.id = regions.world_id 
      AND worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update regions in their worlds"
  ON regions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM worlds 
      WHERE worlds.id = regions.world_id 
      AND worlds.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM worlds 
      WHERE worlds.id = regions.world_id 
      AND worlds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete regions from their worlds"
  ON regions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM worlds 
      WHERE worlds.id = regions.world_id 
      AND worlds.user_id = auth.uid()
    )
  );

-- Create similar RLS policies for all other component tables
CREATE POLICY "Users can view governments from their worlds"
  ON governments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = governments.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can create governments in their worlds"
  ON governments FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = governments.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can update governments in their worlds"
  ON governments FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = governments.world_id AND worlds.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = governments.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can delete governments from their worlds"
  ON governments FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = governments.world_id AND worlds.user_id = auth.uid()));

-- Geographical features policies
CREATE POLICY "Users can view geographical features from their worlds"
  ON geographical_features FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = geographical_features.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can create geographical features in their worlds"
  ON geographical_features FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = geographical_features.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can update geographical features in their worlds"
  ON geographical_features FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = geographical_features.world_id AND worlds.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = geographical_features.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can delete geographical features from their worlds"
  ON geographical_features FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = geographical_features.world_id AND worlds.user_id = auth.uid()));

-- Settlements policies
CREATE POLICY "Users can view settlements from their worlds"
  ON settlements FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = settlements.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can create settlements in their worlds"
  ON settlements FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = settlements.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can update settlements in their worlds"
  ON settlements FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = settlements.world_id AND worlds.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = settlements.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can delete settlements from their worlds"
  ON settlements FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = settlements.world_id AND worlds.user_id = auth.uid()));

-- Sites policies
CREATE POLICY "Users can view sites from their worlds"
  ON sites FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = sites.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can create sites in their worlds"
  ON sites FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = sites.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can update sites in their worlds"
  ON sites FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = sites.world_id AND worlds.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = sites.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can delete sites from their worlds"
  ON sites FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = sites.world_id AND worlds.user_id = auth.uid()));

-- Characters policies
CREATE POLICY "Users can view characters from their worlds"
  ON characters FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = characters.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can create characters in their worlds"
  ON characters FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = characters.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can update characters in their worlds"
  ON characters FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = characters.world_id AND worlds.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = characters.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can delete characters from their worlds"
  ON characters FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = characters.world_id AND worlds.user_id = auth.uid()));

-- Adventures policies
CREATE POLICY "Users can view adventures from their worlds"
  ON adventures FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = adventures.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can create adventures in their worlds"
  ON adventures FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = adventures.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can update adventures in their worlds"
  ON adventures FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = adventures.world_id AND worlds.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = adventures.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can delete adventures from their worlds"
  ON adventures FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = adventures.world_id AND worlds.user_id = auth.uid()));

-- History policies
CREATE POLICY "Users can view history from their worlds"
  ON history FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = history.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can create history in their worlds"
  ON history FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = history.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can update history in their worlds"
  ON history FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = history.world_id AND worlds.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = history.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can delete history from their worlds"
  ON history FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = history.world_id AND worlds.user_id = auth.uid()));

-- Monsters policies
CREATE POLICY "Users can view monsters from their worlds"
  ON monsters FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = monsters.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can create monsters in their worlds"
  ON monsters FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = monsters.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can update monsters in their worlds"
  ON monsters FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = monsters.world_id AND worlds.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = monsters.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can delete monsters from their worlds"
  ON monsters FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = monsters.world_id AND worlds.user_id = auth.uid()));

-- Items policies
CREATE POLICY "Users can view items from their worlds"
  ON items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = items.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can create items in their worlds"
  ON items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = items.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can update items in their worlds"
  ON items FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = items.world_id AND worlds.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = items.world_id AND worlds.user_id = auth.uid()));

CREATE POLICY "Users can delete items from their worlds"
  ON items FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM worlds WHERE worlds.id = items.world_id AND worlds.user_id = auth.uid()));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_worlds_updated_at BEFORE UPDATE ON worlds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_regions_updated_at BEFORE UPDATE ON regions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_governments_updated_at BEFORE UPDATE ON governments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_geographical_features_updated_at BEFORE UPDATE ON geographical_features FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settlements_updated_at BEFORE UPDATE ON settlements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_adventures_updated_at BEFORE UPDATE ON adventures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_history_updated_at BEFORE UPDATE ON history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monsters_updated_at BEFORE UPDATE ON monsters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();