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
  TrendingUp,
  Clock,
  Globe,
  ChevronDown
} from 'lucide-react';
import { World } from '../types/world';

interface DashboardProps {
  worldName: string;
  onComponentSelect: (component: string) => void;
  componentCounts: { [key: string]: number };
  worlds: World[];
  currentWorld: World | null;
  onWorldSelect: (world: World) => void;
  onWorldEdit: () => void;
}

export default function Dashboard({ 
  worldName, 
  onComponentSelect, 
  componentCounts, 
  worlds, 
  currentWorld, 
  onWorldSelect, 
  onWorldEdit 
}: DashboardProps) {
  const recentActivity: any[] = [];

  const stats = [
    { name: 'Regions', count: componentCounts.regions || 0, icon: Map, color: 'bg-blue-500' },
    { name: 'Characters', count: componentCounts.characters || 0, icon: Users, color: 'bg-green-500' },
    { name: 'Adventures', count: componentCounts.adventures || 0, icon: Sword, color: 'bg-red-500' },
    { name: 'Items', count: componentCounts.items || 0, icon: Package, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* World Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current World:</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                value={currentWorld?.id || ''}
                onChange={(e) => {
                  const selectedWorld = worlds.find(w => w.id === e.target.value);
                  if (selectedWorld) onWorldSelect(selectedWorld);
                }}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {worlds.map(world => (
                  <option key={world.id} value={world.id}>
                    {world.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
            <button
              onClick={onWorldEdit}
              className="px-3 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            >
              Edit World
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2 text-white">Welcome to {worldName}</h1>
        <p className="text-purple-100 dark:text-purple-200 text-lg">
          Build your world one component at a time with AI assistance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.name}
              onClick={() => onComponentSelect(stat.name.toLowerCase())}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all hover:scale-105 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.count}</p>
                <p className="text-gray-600 dark:text-gray-400">{stat.name}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            </div>
          </div>
          <div className="p-6">
            {recentActivity.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No activity yet. Start creating components to see updates here.
              </p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'created' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">
                          {activity.type === 'created' ? 'Created' : 'Updated'}
                        </span>{' '}
                        {activity.component.toLowerCase()} "{activity.name}"
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onComponentSelect('regions')}
                className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-200 dark:hover:border-purple-700 transition-colors"
              >
                <Map className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Create Region</span>
              </button>
              <button
                onClick={() => onComponentSelect('characters')}
                className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-700 transition-colors"
              >
                <Users className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Add Character</span>
              </button>
              <button
                onClick={() => onComponentSelect('adventures')}
                className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-700 transition-colors"
              >
                <Sword className="w-8 h-8 text-red-600 dark:text-red-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Plan Adventure</span>
              </button>
              <button
                onClick={() => onComponentSelect('settlements')}
                className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700 transition-colors"
              >
                <Home className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Build Settlement</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}