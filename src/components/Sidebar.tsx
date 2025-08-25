import React from 'react';
import { 
  Map, 
  Crown, 
  Mountain, 
  Building, 
  Sword, 
  Users, 
  BookOpen, 
  Skull, 
  Package, 
  Home,
  Plus
} from 'lucide-react';

interface SidebarProps {
  activeComponent: string;
  onComponentSelect: (component: string) => void;
  onNewComponent: (type: string) => void;
  componentCounts: { [key: string]: number };
}

const componentTypes = [
  { id: 'regions', name: 'Regions', icon: Map },
  { id: 'governments', name: 'Governments', icon: Crown },
  { id: 'geographical', name: 'Geographical Features', icon: Mountain },
  { id: 'sites', name: 'Sites', icon: Building },
  { id: 'adventures', name: 'Adventures', icon: Sword },
  { id: 'characters', name: 'Characters', icon: Users },
  { id: 'history', name: 'History', icon: BookOpen },
  { id: 'monsters', name: 'Monsters', icon: Skull },
  { id: 'items', name: 'Items', icon: Package },
  { id: 'settlements', name: 'Settlements', icon: Home },
];

export default function Sidebar({ activeComponent, onComponentSelect, onNewComponent, componentCounts }: SidebarProps) {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">World Components</h2>
        <div className="space-y-2">
          {componentTypes.map((component) => {
            const Icon = component.icon;
            const isActive = activeComponent === component.id;
            const count = componentCounts[component.id] || 0;
            
            return (
              <div key={component.id} className="flex items-center space-x-2">
                <button
                  onClick={() => onComponentSelect(component.id)}
                  className={`flex-1 flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{component.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isActive ? 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {count}
                  </span>
                </button>
                <button
                  onClick={() => onNewComponent(component.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}