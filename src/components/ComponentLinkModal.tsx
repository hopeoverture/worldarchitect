import React, { useState, useEffect } from 'react';
import { Search, X, Link, Map, Crown, Mountain, Building, Users, Home, Sword, BookOpen, Skull, Package } from 'lucide-react';
import { useComponents } from '../hooks/useComponents';

interface Component {
  id: string;
  name: string;
  type: string;
  description?: string;
}

interface ComponentLinkModalProps {
  worldId: string;
  onClose: () => void;
  onSelect: (component: Component) => void;
  selectedComponents: string[];
  title?: string;
}

const componentTypes = [
  { id: 'regions', name: 'Regions', icon: Map, color: 'text-blue-600' },
  { id: 'governments', name: 'Governments', icon: Crown, color: 'text-purple-600' },
  { id: 'geographical', name: 'Geographical Features', icon: Mountain, color: 'text-green-600' },
  { id: 'sites', name: 'Sites', icon: Building, color: 'text-orange-600' },
  { id: 'settlements', name: 'Settlements', icon: Home, color: 'text-indigo-600' },
  { id: 'characters', name: 'Characters', icon: Users, color: 'text-pink-600' },
  { id: 'adventures', name: 'Adventures', icon: Sword, color: 'text-red-600' },
  { id: 'history', name: 'History', icon: BookOpen, color: 'text-amber-600' },
  { id: 'monsters', name: 'Monsters', icon: Skull, color: 'text-gray-600' },
  { id: 'items', name: 'Items', icon: Package, color: 'text-emerald-600' },
];

export default function ComponentLinkModal({ 
  worldId, 
  onClose, 
  onSelect, 
  selectedComponents,
  title = "Link Components"
}: ComponentLinkModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [allComponents, setAllComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);

  // Get all components from all types
  const componentHooks = {
    regions: useComponents('regions', worldId),
    governments: useComponents('governments', worldId),
    geographical: useComponents('geographical', worldId),
    sites: useComponents('sites', worldId),
    settlements: useComponents('settlements', worldId),
    characters: useComponents('characters', worldId),
    adventures: useComponents('adventures', worldId),
    history: useComponents('history', worldId),
    monsters: useComponents('monsters', worldId),
    items: useComponents('items', worldId),
  };

  useEffect(() => {
    const components: Component[] = [];
    
    Object.entries(componentHooks).forEach(([type, hook]) => {
      if (hook.components) {
        hook.components.forEach(component => {
          if (!component) return; // Skip null/undefined components
          
          components.push({
            id: component.id,
            name: component.name || '',
            type: type === 'monsters' ? 'Monster' : (componentTypes.find(ct => ct.id === type)?.name || type),
            description: component.description || ''
          });
        });
      }
    });

    setAllComponents(components);
    setLoading(false);
  }, [Object.values(componentHooks).map(h => h.components)]);

  const filteredComponents = allComponents.filter(component =>
    (component.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (component.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (component.description && component.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getComponentIcon = (type: string) => {
    const componentType = componentTypes.find(ct => ct.name === type);
    if (componentType) {
      const Icon = componentType.icon;
      return <Icon className={`w-5 h-5 ${componentType.color}`} />;
    }
    return <Link className="w-5 h-5 text-gray-500" />;
  };

  const isSelected = (componentId: string) => selectedComponents.includes(componentId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search components by name, type, or description..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading components...</p>
            </div>
          ) : filteredComponents.length === 0 ? (
            <div className="text-center py-8">
              <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No matching components' : 'No components available'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Create some components first to link them together'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredComponents.map((component) => (
                <button
                  key={component.id}
                  onClick={() => onSelect(component)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    isSelected(component.id)
                      ? 'border-purple-200 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getComponentIcon(component.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {component.name}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {component.type}
                        </span>
                        {isSelected(component.id) && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                            Linked
                          </span>
                        )}
                      </div>
                      {component.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {component.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {selectedComponents.length} component{selectedComponents.length !== 1 ? 's' : ''} linked
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}