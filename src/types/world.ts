export interface World {
  id: string;
  name: string;
  description: string;
  tone?: 'heroic_hopeful' | 'grounded' | 'dark_gritty';
  magic_level?: 'none' | 'low' | 'moderate' | 'high';
  tech_level?: 'stone_age' | 'bronze_age' | 'iron_age' | 'medieval' | 'renaissance' | 'industrial' | 'electrical_mechanized' | 'nuclear' | 'information_age' | 'near_future' | 'futuristic_space_travel';
  authority_structure?: string[];
  daily_life_pressures?: string[];
  general_description_style?: string;
  created_at: string;
  user_id: string;
}

export interface Region {
  id: string;
  world_id: string;
  name: string;
  primary_terrain: 'forest' | 'mountain' | 'desert' | 'plains' | 'swamp' | 'tundra' | 'coast' | 'island';
  linked_components: string[];
  description: string;
  created_at: string;
}

export interface Government {
  id: string;
  world_id: string;
  name: string;
  government_type: 'monarchy' | 'democracy' | 'oligarchy' | 'theocracy' | 'dictatorship' | 'tribal' | 'federation' | 'empire';
  linked_region?: string;
  linked_components?: string[];
  leadership: string;
  description: string;
  created_at: string;
}

export interface GeographicalFeature {
  id: string;
  world_id: string;
  name: string;
  feature_type: 'forest' | 'mountain' | 'river' | 'lake' | 'ocean' | 'canyon' | 'cave' | 'volcano' | 'glacier';
  linked_region?: string;
  linked_components?: string[];
  description: string;
  created_at: string;
}

export interface Site {
  id: string;
  world_id: string;
  name: string;
  site_type: 'shop' | 'tavern' | 'temple' | 'library' | 'fortress' | 'ruins' | 'landmark' | 'dungeon';
  linked_settlement?: string;
  linked_region?: string;
  linked_components?: string[];
  description: string;
  created_at: string;
}

export interface Adventure {
  id: string;
  world_id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  linked_components: string[];
  description: string;
  objectives: string;
  rewards: string;
  created_at: string;
}

export interface Character {
  id: string;
  world_id: string;
  name: string;
  race: string;
  class_profession: string;
  alignment: 'lawful_good' | 'neutral_good' | 'chaotic_good' | 'lawful_neutral' | 'true_neutral' | 'chaotic_neutral' | 'lawful_evil' | 'neutral_evil' | 'chaotic_evil';
  linked_settlement?: string;
  linked_components?: string[];
  role: string;
  description: string;
  created_at: string;
}

export interface History {
  id: string;
  world_id: string;
  title: string;
  era: string;
  linked_components: string[];
  description: string;
  created_at: string;
}

export interface Monster {
  id: string;
  world_id: string;
  name: string;
  monster_type: 'beast' | 'humanoid' | 'undead' | 'dragon' | 'fiend' | 'celestial' | 'fey' | 'elemental' | 'aberration';
  challenge_rating: string;
  habitat: string;
  linked_region?: string;
  linked_components?: string[];
  description: string;
  abilities: string;
  created_at: string;
}

export interface Item {
  id: string;
  world_id: string;
  name: string;
  item_type: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'tool' | 'treasure' | 'artifact' | 'mundane';
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary' | 'artifact';
  linked_character?: string;
  linked_site?: string;
  description: string;
  properties: string;
  created_at: string;
}

export interface Settlement {
  id: string;
  world_id: string;
  name: string;
  settlement_type: 'village' | 'town' | 'city' | 'capital' | 'outpost' | 'fortress' | 'trading_post';
  population: number;
  linked_region?: string;
  linked_government?: string;
  description: string;
  notable_features: string;
  created_at: string;
}