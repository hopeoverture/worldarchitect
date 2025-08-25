import React, { useState } from 'react';
import { Sparkles, Save, X, Link } from 'lucide-react';
import { useComponents } from '../../hooks/useComponents';
import { generateCharacterDescription } from '../../lib/openai';
import ComponentLinkModal from '../ComponentLinkModal';

interface CharacterFormProps {
  worldId: string;
  worldContext?: string;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function CharacterForm({ worldId, worldContext = '', onClose, onSave }: CharacterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    race: '',
    class_profession: '',
    alignment: '',
    linked_settlement: '',
    linked_components: [] as string[],
    role: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  
  const { components: settlements } = useComponents('settlements', worldId);

  const alignmentOptions = [
    'lawful_good', 'neutral_good', 'chaotic_good',
    'lawful_neutral', 'true_neutral', 'chaotic_neutral',
    'lawful_evil', 'neutral_evil', 'chaotic_evil'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert empty strings to null for UUID fields
      const cleanedData = {
        ...formData,
        linked_settlement: formData.linked_settlement || null,
        linked_components: formData.linked_components
      };
      await onSave(cleanedData);
    } catch (error) {
      console.error('Failed to save character:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWithAI = async () => {
    if (!formData.name) {
      alert('Please enter a character name first');
      return;
    }

    setLoading(true);
    try {
      const generatedDescription = await generateCharacterDescription({
        name: formData.name,
        race: formData.race,
        class_profession: formData.class_profession,
        alignment: formData.alignment,
        linked_settlement: formData.linked_settlement,
        linked_components: formData.linked_components,
        role: formData.role,
        world_context: worldContext
      });
      
      setFormData(prev => ({ ...prev, description: generatedDescription }));
    } catch (error) {
      console.error('Failed to generate description:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatAlignment = (alignment: string) => {
    return alignment.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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
          <h2 className="text-2xl font-bold text-gray-900">Create New Character</h2>
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
                Character Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter character name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Race
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.race}
                onChange={(e) => setFormData(prev => ({ ...prev, race: e.target.value }))}
                placeholder="e.g., Human, Elf, Dwarf..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class/Profession
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.class_profession}
                onChange={(e) => setFormData(prev => ({ ...prev, class_profession: e.target.value }))}
                placeholder="e.g., Wizard, Merchant, Guard..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alignment
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.alignment}
                onChange={(e) => setFormData(prev => ({ ...prev, alignment: e.target.value }))}
              >
                <option value="">Select alignment...</option>
                {alignmentOptions.map(alignment => (
                  <option key={alignment} value={alignment}>
                    {formatAlignment(alignment)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Linked Settlement (Optional)
            </label>
            {settlements.length === 0 ? (
              <div>
                <div className="text-sm text-gray-500 mb-2">
                  No settlements available yet. Create settlements first to link them.
                </div>
                <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-400">
                  Select character's home settlement...
                </div>
              </div>
            ) : (
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.linked_settlement}
                onChange={(e) => setFormData(prev => ({ ...prev, linked_settlement: e.target.value }))}
              >
                <option value="">Select character's home settlement...</option>
                {settlements.map(settlement => (
                  <option key={settlement.id} value={settlement.id}>
                    {settlement.name}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              placeholder="e.g., Village Elder, Shop Owner, Quest Giver..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Character Description
              </label>
              <button
                type="button"
                onClick={generateWithAI}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105"
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
              placeholder="Describe the character's appearance, personality, background, motivations..."
            />
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
              <span>{loading ? 'Saving...' : 'Save Character'}</span>
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
          title="Link Components to Character"
        />
      )}
    </div>
  );
}