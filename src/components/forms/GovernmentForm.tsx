import React, { useState } from 'react';
import { Sparkles, Save, X, Link } from 'lucide-react';
import { useComponents } from '../../hooks/useComponents';
import { generateGovernmentLeadership, generateGovernmentDescription } from '../../lib/openai';
import ComponentLinkModal from '../ComponentLinkModal';

interface GovernmentFormProps {
  worldId: string;
  worldContext?: string;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function GovernmentForm({ worldId, worldContext = '', onClose, onSave }: GovernmentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    government_type: '',
    linked_region: '',
    linked_components: [] as string[],
    leadership: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  
  const { components: regions } = useComponents('regions', worldId);

  const governmentTypes = [
    'monarchy', 'democracy', 'oligarchy', 'theocracy', 'dictatorship', 'tribal', 'federation', 'empire'
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
      console.error('Failed to save government:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWithAI = async (field: string) => {
    if (!formData.name || !formData.government_type) {
      alert('Please enter a name and select government type first');
      return;
    }

    setLoading(true);
    try {
      let generatedContent: string;
      
      if (field === 'leadership') {
        generatedContent = await generateGovernmentLeadership({
          name: formData.name,
          government_type: formData.government_type,
          linked_region: formData.linked_region,
          linked_components: formData.linked_components,
          world_context: worldContext
        });
      } else {
        generatedContent = await generateGovernmentDescription({
          name: formData.name,
          government_type: formData.government_type,
          linked_region: formData.linked_region,
          linked_components: formData.linked_components,
          world_context: worldContext
        });
      }
      
      setFormData(prev => ({ ...prev, [field]: generatedContent }));
    } catch (error) {
      console.error(`Failed to generate ${field}:`, error);
      alert(`Failed to generate ${field}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const generateWithAIOld = async (field: string) => {
    if (field === 'leadership') {
      setFormData(prev => ({
        ...prev,
        leadership: 'AI-generated leader would appear here...'
      }));
    } else if (field === 'description') {
      setFormData(prev => ({
        ...prev,
        description: 'AI-generated description would appear here...'
      }));
    }
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
          <h2 className="text-2xl font-bold text-gray-900">Create New Government</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Government Name *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter government name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Government Type *
            </label>
            <select
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={formData.government_type}
              onChange={(e) => setFormData(prev => ({ ...prev, government_type: e.target.value }))}
            >
              <option value="">Select type...</option>
              {governmentTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
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
                  Select region to govern...
                </div>
              </div>
            ) : (
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.linked_region}
                onChange={(e) => setFormData(prev => ({ ...prev, linked_region: e.target.value }))}
              >
                <option value="">Select region to govern...</option>
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
                Leadership
              </label>
              <button
                type="button"
                onClick={() => generateWithAI('leadership')}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105"
              >
                <Sparkles className="w-3 h-3" />
                <span>Generate with AI</span>
              </button>
            </div>
            <textarea
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              value={formData.leadership}
              onChange={(e) => setFormData(prev => ({ ...prev, leadership: e.target.value }))}
              placeholder="Describe the leadership structure or specific leaders..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                General Description
              </label>
              <button
                type="button"
                onClick={() => generateWithAI('description')}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
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
              placeholder="Describe the government's structure, laws, culture, and how it operates..."
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
              <span>{loading ? 'Saving...' : 'Save Government'}</span>
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
          title="Link Components to Government"
        />
      )}
    </div>
  );
}