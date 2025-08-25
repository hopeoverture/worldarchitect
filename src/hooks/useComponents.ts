import { useState, useEffect } from 'react';
import { componentService, componentTableMap } from '../lib/supabase';

export function useComponents(componentType: string, worldId: string | null) {
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tableName = componentTableMap[componentType];

  useEffect(() => {
    if (!worldId || !tableName) {
      setComponents([]);
      return;
    }

    const fetchComponents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await componentService.getComponents(tableName, worldId);
        setComponents(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch components');
        setComponents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, [componentType, worldId, tableName]);

  const createComponent = async (componentData: any) => {
    if (!worldId || !tableName) throw new Error('No world selected');
    
    try {
      const newComponent = await componentService.createComponent(tableName, componentData, worldId);
      setComponents(prev => [newComponent, ...prev]);
      return newComponent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create component');
      throw err;
    }
  };

  const updateComponent = async (id: string, componentData: any) => {
    if (!tableName) throw new Error('Invalid component type');
    
    try {
      const updatedComponent = await componentService.updateComponent(tableName, id, componentData);
      setComponents(prev => prev.map(comp => comp.id === id ? updatedComponent : comp));
      return updatedComponent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update component');
      throw err;
    }
  };

  const deleteComponent = async (id: string) => {
    if (!tableName) throw new Error('Invalid component type');
    
    try {
      await componentService.deleteComponent(tableName, id);
      setComponents(prev => prev.filter(comp => comp.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete component');
      throw err;
    }
  };

  return {
    components,
    loading,
    error,
    createComponent,
    updateComponent,
    deleteComponent
  };
}