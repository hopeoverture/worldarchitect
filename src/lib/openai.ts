import { supabase } from './supabase';

export interface GenerateContentRequest {
  type: 'world_name' | 'world_description' | 'region_description' | 'government_leadership' | 'government_description' | 'character_description' | 'geographical_description' | 'site_description' | 'adventure_description' | 'adventure_objectives' | 'adventure_rewards' | 'history_description' | 'monster_description' | 'monster_abilities';
  data: any;
}

export async function generateContent(request: GenerateContentRequest): Promise<string> {
  try {
    console.log('Calling Supabase function with request:', request);
    
    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: request
    });

    console.log('Supabase function response:', { data, error });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Supabase function error: ${error.message || 'Edge Function returned a non-2xx status code'}`);
    }

    if (!data?.content) {
      console.error('No content in response:', data);
      throw new Error(`No content received from AI. Response: ${JSON.stringify(data)}`);
    }

    console.log('Generated content:', data.content);
    return data.content;
  } catch (error) {
    console.error('Content generation error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Content generation failed: ${String(error)}`);
  }
}

// Helper functions for specific content types
export async function generateWorldName(worldData: {
  tone: string;
  magic_level: string;
  tech_level: string;
}): Promise<string> {
  return generateContent({
    type: 'world_name',
    data: worldData
  });
}

export async function generateWorldDescription(worldData: {
  tone: string;
  magic_level: string;
  tech_level: string;
  authority_structure?: string[];
  daily_life_pressures?: string[];
}): Promise<string> {
  return generateContent({
    type: 'world_description',
    data: worldData
  });
}

export async function generateRegionDescription(regionData: {
  name: string;
  primary_terrain: string;
  linked_components?: string[];
  world_context: string;
}): Promise<string> {
  return generateContent({
    type: 'region_description',
    data: regionData
  });
}

export async function generateGovernmentLeadership(governmentData: {
  name: string;
  government_type: string;
  linked_region?: string;
  linked_components?: string[];
  world_context: string;
}): Promise<string> {
  return generateContent({
    type: 'government_leadership',
    data: governmentData
  });
}

export async function generateGovernmentDescription(governmentData: {
  name: string;
  government_type: string;
  linked_region?: string;
  linked_components?: string[];
  world_context: string;
}): Promise<string> {
  return generateContent({
    type: 'government_description',
    data: governmentData
  });
}

export async function generateCharacterDescription(characterData: {
  name: string;
  race?: string;
  class_profession?: string;
  alignment?: string;
  linked_settlement?: string;
  linked_components?: string[];
  role?: string;
  world_context: string;
}): Promise<string> {
  return generateContent({
    type: 'character_description',
    data: characterData
  });
}

export async function generateGeographicalDescription(geographicalData: {
  name: string;
  feature_type: string;
  linked_region?: string;
  linked_components?: string[];
  world_context: string;
}): Promise<string> {
  return generateContent({
    type: 'geographical_description',
    data: geographicalData
  });
}

export async function generateSiteDescription(siteData: {
  name: string;
  site_type: string;
  linked_settlement?: string;
  linked_region?: string;
  linked_components?: string[];
  world_context: string;
}): Promise<string> {
  return generateContent({
    type: 'site_description',
    data: siteData
  });
}

export async function generateAdventureDescription(adventureData: {
  name: string;
  difficulty: string;
  linked_components?: string[];
  world_context: string;
}): Promise<string> {
  return generateContent({
    type: 'adventure_description',
    data: adventureData
  });
}

export async function generateAdventureObjectives(adventureData: {
  name: string;
  difficulty: string;
  linked_components?: string[];
  world_context: string;
}): Promise<string> {
  return generateContent({
    type: 'adventure_objectives',
    data: adventureData
  });
}

export async function generateAdventureRewards(adventureData: {
  name: string;
  difficulty: string;
  linked_components?: string[];
  world_context: string;
}): Promise<string> {
  return generateContent({
    type: 'adventure_rewards',
    data: adventureData
  });
}

export async function generateHistoryDescription(historyData: {
  title: string;
  era?: string;
  linked_components?: string[];
  world_context: string;
}): Promise<string> {
  return generateContent({
    type: 'history_description',
    data: historyData
  });
}

export async function generateMonsterDescription(monsterData: {
  name: string;
  monster_type: string;
  challenge_rating: string;
  habitat?: string;
  linked_region?: string;
  linked_components?: string[];
  world_context: string;
}): Promise<string> {
  return generateContent({
    type: 'monster_description',
    data: monsterData
  });
}

export async function generateMonsterAbilities(monsterData: {
  name: string;
  monster_type: string;
  challenge_rating: string;
  habitat?: string;
  linked_region?: string;
  linked_components?: string[];
  world_context: string;
}): Promise<string> {
  return generateContent({
    type: 'monster_abilities',
    data: monsterData
  });
}