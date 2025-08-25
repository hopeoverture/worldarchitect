import React, { useState } from 'react';
import { logger } from '../../lib/logger';
import { Sparkles, Save, X, Link } from 'lucide-react';
import { useComponents } from '../../hooks/useComponents';
import { generateMonsterDescription, generateMonsterAbilities } from '../../lib/openai';
import ComponentLinkModal from '../ComponentLinkModal';

interface MonsterFormProps {
  worldId: string;
  worldContext?: string;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function MonsterForm({ worldId, worldContext = '', onClose, onSave }: MonsterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    monster_type: '',
    challenge_rating: '1',
    habitat: '',
    linked_region: '',
    linked_components: [] as string[],
    description: '',
    abilities: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  
  const { components: regions } = useComponents('regions', worldId);

  const monsterTypes = [
    'beast', 'humanoid', 'undead', 'dragon', 'fiend', 'celestial', 'fey', 'elemental', 'aberration'
  ];

  const challengeRatings = [
    '0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '30'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert empty strings to null for UUID fields
      const cleanedData = {
        ...formData,
        linked_region: formData.linked_region || null,
        linked_components: formData.linked_components
      };
      await onSave(cleanedData);
    } catch (error) {
  logger.error('Failed to save monster:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWithAI = async (field: string) => {
    if (!formData.name || !formData.monster_type) {
      setError('Please enter a name and select monster type first');
      return;
    }

    setError('');
    setLoading(true);
    try {
      let generatedContent: string;
      
      if (field === 'description') {
        generatedContent = await generateMonsterDescription({
          name: formData.name,
          monster_type: formData.monster_type,
          challenge_rating: formData.challenge_rating,
          habitat: formData.habitat,
          linked_region: formData.linked_region,
          linked_components: formData.linked_components,
          world_context: worldContext
        });
      } else {
        generatedContent = await generateMonsterAbilities({
          name: formData.name,
          monster_type: formData.monster_type,
          challenge_rating: formData.challenge_rating,
          habitat: formData.habitat,
          linked_region: formData.linked_region,
          linked_components: formData.linked_components,
          world_context: worldContext
        });
      }
      
      setFormData(prev => ({ ...prev, [field]: generatedContent }));
    } catch (error) {
  logger.error(`Failed to generate ${field}:`, error);
      setError(error instanceof Error ? error.message : `Failed to generate ${field}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const formatMonsterType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleComponentLink = (component: any) => {
    setFormData(prev => ({
      ...prev,
      linked_components: prev.linked_components.includes(component.id)
        ? prev.linked_components.filter(id => id !== component.id)
        : [...prev.linked_components, component.id]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Monster</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monster Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter monster name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monster Type *
              </label>
              <select
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.monster_type}
                onChange={(e) => setFormData(prev => ({ ...prev, monster_type: e.target.value }))}
              >
                <option value="">Select monster type...</option>
                {monsterTypes.map(type => (
                  <option key={type} value={type}>
                    {formatMonsterType(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Challenge Rating
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.challenge_rating}
                onChange={(e) => setFormData(prev => ({ ...prev, challenge_rating: e.target.value }))}
              >
                {challengeRatings.map(rating => (
                  <option key={rating} value={rating}>
                    CR {rating}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habitat
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.habitat}
                onChange={(e) => setFormData(prev => ({ ...prev, habitat: e.target.value }))}
                placeholder="e.g., Dark forests, Underground caves..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Linked Region (Optional)
            </label>
            {regions.length === 0 ? (
              <div>
                <div className="text-sm text-gray-500 mb-2">
                  No regions available yet. Create regions first to link them.
                </div>
                <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-400">
                  Select region where this monster is found...
                </div>
              </div>
            ) : (
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.linked_region}
                onChange={(e) => setFormData(prev => ({ ...prev, linked_region: e.target.value }))}
              >
                <option value="">Select region where this monster is found...</option>
                {regions.map(region => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Additional Linked Components (Optional)
              </label>
              <button
                type="button"
                onClick={() => setShowLinkModal(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-700 transition-all"
              >
                <Link className="w-3 h-3" />
                <span>Link Components</span>
              </button>
            </div>
            <div className="min-h-[60px] p-3 border border-gray-200 rounded-lg bg-gray-50">
              {formData.linked_components.length === 0 ? (
                <p className="text-gray-500 text-sm">No additional components linked yet. Click "Link Components" to add connections.</p>
              ) : (
                <p className="text-gray-700 text-sm">
                  {formData.linked_components.length} component{formData.linked_components.length !== 1 ? 's' : ''} linked
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Monster Description
              </label>
              <button
                type="button"
                onClick={() => generateWithAI('description')}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-gray-600 to-slate-600 text-white text-xs rounded-lg hover:from-gray-700 hover:to-slate-700 transition-all transform hover:scale-105"
              >
                <Sparkles className="w-3 h-3" />
                <span>Generate with AI</span>
              </button>
            </div>
            <textarea
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this monster's appearance, behavior, and lore..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Abilities & Powers
              </label>
              <button
                type="button"
                onClick={() => generateWithAI('abilities')}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-red-600 to-crimson-600 text-white text-xs rounded-lg hover:from-red-700 hover:to-crimson-700 transition-all transform hover:scale-105"
              >
                <Sparkles className="w-3 h-3" />
                <span>Generate with AI</span>
              </button>
            </div>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              value={formData.abilities}
              onChange={(e) => setFormData(prev => ({ ...prev, abilities: e.target.value }))}
              placeholder="Describe special abilities, attacks, and powers this monster possesses..."
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Monster'}</span>
            </button>
          </div>
        </form>
      </div>
      
      {showLinkModal && (
        <ComponentLinkModal
          worldId={worldId}
          onClose={() => setShowLinkModal(false)}
          onSelect={handleComponentLink}
          selectedComponents={formData.linked_components}
          title="Link Components to Monster"
        />
      )}
    </div>
  );
}