import { useState, useEffect } from 'react';
import { worldService } from '../lib/supabase';
import { World } from '../types/world';

export function useWorlds() {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [currentWorld, setCurrentWorld] = useState<World | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorlds();
  }, []);

  const fetchWorlds = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await worldService.getWorlds();
      setWorlds(data || []);
      
      // Set first world as current if none selected
      if (data && data.length > 0 && !currentWorld) {
        setCurrentWorld(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch worlds');
    } finally {
      setLoading(false);
    }
  };

  const createWorld = async (worldData: Partial<World>) => {
    try {
      const newWorld = await worldService.createWorld(worldData);
      setWorlds(prev => [newWorld, ...prev]);
      setCurrentWorld(newWorld);
      return newWorld;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create world');
      throw err;
    }
  };

  const updateWorld = async (id: string, worldData: Partial<World>) => {
    try {
      const updatedWorld = await worldService.updateWorld(id, worldData);
      setWorlds(prev => prev.map(world => world.id === id ? updatedWorld : world));
      if (currentWorld?.id === id) {
        setCurrentWorld(updatedWorld);
      }
      return updatedWorld;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update world');
      throw err;
    }
  };

  const deleteWorld = async (id: string) => {
    try {
      await worldService.deleteWorld(id);
      setWorlds(prev => prev.filter(world => world.id !== id));
      if (currentWorld?.id === id) {
        const remainingWorlds = worlds.filter(world => world.id !== id);
        setCurrentWorld(remainingWorlds.length > 0 ? remainingWorlds[0] : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete world');
      throw err;
    }
  };

  return {
    worlds,
    currentWorld,
    setCurrentWorld,
    loading,
    error,
    createWorld,
    updateWorld,
    deleteWorld,
    refetch: fetchWorlds
  };
}