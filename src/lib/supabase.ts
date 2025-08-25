import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User service functions
export const userService = {
  async checkDisplayNameAvailability(displayName: string, currentUserId?: string) {
    let query = supabase
      .from('users')
      .select('id')
      .eq('display_name', displayName);
    
    // If updating current user, exclude their own record
    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Return true if available (no records found)
    return data.length === 0;
  },

  async updateDisplayName(userId: string, displayName: string) {
    // First check if the name is available
    const isAvailable = await this.checkDisplayNameAvailability(displayName, userId);
    if (!isAvailable) {
      throw new Error('This display name is already taken. Please choose a different one.');
    }

    // Update in users table
    const { error: usersError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        display_name: displayName
      });
    
    if (usersError) throw usersError;

    // Update in auth metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        display_name: displayName
      }
    });
    
    if (authError) throw authError;
  }
};

// Helper function to get current user ID
export const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
};

// Database service functions
export const worldService = {
  async getWorlds() {
    const { data, error } = await supabase
      .from('worlds')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createWorld(worldData: any) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('worlds')
      .insert({ ...worldData, user_id: userId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateWorld(id: string, worldData: any) {
    const { data, error } = await supabase
      .from('worlds')
      .update(worldData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteWorld(id: string) {
    const { error } = await supabase
      .from('worlds')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const componentService = {
  async getComponents(tableName: string, worldId: string) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('world_id', worldId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createComponent(tableName: string, componentData: any, worldId: string) {
    const { data, error } = await supabase
      .from(tableName)
      .insert({ ...componentData, world_id: worldId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateComponent(tableName: string, id: string, componentData: any) {
    const { data, error } = await supabase
      .from(tableName)
      .update(componentData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteComponent(tableName: string, id: string) {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Component table mapping
export const componentTableMap: { [key: string]: string } = {
  regions: 'regions',
  governments: 'governments',
  geographical: 'geographical_features',
  sites: 'sites',
  adventures: 'adventures',
  characters: 'characters',
  history: 'history',
  monsters: 'monsters',
  items: 'items',
  settlements: 'settlements'
};