import React, { useState } from 'react';
import { Globe, Plus, Edit, Trash2, X, Save, Sparkles } from 'lucide-react';
import { World } from '../types/world';
import { generateWorldName, generateWorldDescription } from '../lib/openai';

interface WorldSelectorProps {
  worlds: World[];
  currentWorld: World | null;
  onWorldSelect: (world: World) => void;
  onWorldCreate: (worldData: Partial<World>) => void;
  onWorldDelete: (worldId: string) => void;
  onWorldEdit: (worldId: string, worldData: Partial<World>) => void;
}

export default function WorldSelector({ 
  worlds, 
  currentWorld, 
  onWorldSelect, 
  onWorldCreate,
  onWorldDelete,
  onWorldEdit
}: WorldSelectorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWorld, setEditingWorld] = useState<World | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tone: '',
    magic_level: '',
    tech_level: '',
    authority_structure: [] as string[],
    daily_life_pressures: [] as string[],
    general_description_style: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    description: ''
  });

  const toneOptions = [
    { value: 'heroic_hopeful', label: 'Heroic & Hopeful' },
    { value: 'grounded', label: 'Grounded' },
    { value: 'dark_gritty', label: 'Dark & Gritty' }
  ];

  const magicLevelOptions = [
    { value: 'none', label: 'None' },
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' }
  ];

  const techLevelOptions = [
    { value: 'stone_age', label: 'Stone Age' },
    { value: 'bronze_age', label: 'Bronze Age' },
    { value: 'iron_age', label: 'Iron Age' },
    { value: 'medieval', label: 'Medieval' },
    { value: 'renaissance', label: 'Renaissance' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'electrical_mechanized', label: 'Electrical/Mechanized' },
    { value: 'nuclear', label: 'Nuclear' },
    { value: 'information_age', label: 'Information Age' },
    { value: 'near_future', label: 'Near-Future' },
    { value: 'futuristic_space_travel', label: 'Futuristic/Space Travel' }
  ];

  const authorityStructureOptions = [
    'Centralized Hierarchy',
    'Elite-Controlled',
    'Local/Fragmented',
    'Power Vacuum/Anarchy'
  ];

  const dailyLifePressuresOptions = [
    'Environmental',
    'Social/Political',
    'Economic/Resource',
    'Metaphysical/Existential'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      if (editingWorld) {
        onWorldEdit(editingWorld.id, formData);
        setEditingWorld(null);
      } else {
        onWorldCreate(formData);
      }
      setFormData({
        name: '',
        description: '',
        tone: '',
        magic_level: '',
        tech_level: '',
        authority_structure: [],
        daily_life_pressures: [],
        general_description_style: ''
      });
      setShowCreateForm(false);
    }
  };

  const handleEdit = (e: React.MouseEvent, world: World) => {
    e.stopPropagation();
    setEditingWorld(world);
    setFormData({
      name: world.name,
      description: world.description || '',
      tone: world.tone || '',
      magic_level: world.magic_level || '',
      tech_level: world.tech_level || '',
      authority_structure: world.authority_structure || [],
      daily_life_pressures: world.daily_life_pressures || [],
      general_description_style: world.general_description_style || ''
    });
    setShowCreateForm(true);
  };

  const handleCancelEdit = () => {
    setEditingWorld(null);
    setFormData({
      name: '',
      description: '',
      tone: '',
      magic_level: '',
      tech_level: '',
      authority_structure: [],
      daily_life_pressures: [],
      general_description_style: ''
    });
    setShowCreateForm(false);
  };

  const handleCheckboxChange = (field: 'authority_structure' | 'daily_life_pressures', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const generateNameWithAI = async () => {
    setErrors(prev => ({ ...prev, name: '' }));
    setLoading(true);
    try {
      const generatedName = await generateWorldName({
        tone: formData.tone,
        magic_level: formData.magic_level,
        tech_level: formData.tech_level
      });
      
      setFormData(prev => ({ ...prev, name: generatedName }));
    } catch (error) {
      console.error('Failed to generate name:', error);
      setErrors(prev => ({ 
        ...prev, 
        name: error instanceof Error ? error.message : 'Failed to generate name. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const generateDescriptionWithAI = async () => {
    setErrors(prev => ({ ...prev, description: '' }));
    setLoading(true);
    try {
      const generatedDescription = await generateWorldDescription({
        tone: formData.tone,
        magic_level: formData.magic_level,
        tech_level: formData.tech_level,
        authority_structure: formData.authority_structure,
        daily_life_pressures: formData.daily_life_pressures
      });
      
      setFormData(prev => ({ ...prev, general_description_style: generatedDescription }));
    } catch (error) {
      console.error('Failed to generate description:', error);
      setErrors(prev => ({ 
        ...prev, 
        description: error instanceof Error ? error.message : 'Failed to generate description. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = (e: React.MouseEvent, worldId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this world? This action cannot be undone.')) {
      onWorldDelete(worldId);
    }
  };

  if (showCreateForm) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingWorld ? 'Edit World' : 'Create New World'}
          </h2>
          <button
            onClick={handleCancelEdit}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* World Name */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                World Name *
              </label>
              <button
                type="button"
                onClick={generateNameWithAI}
                disabled={loading || !formData.tone || !formData.magic_level || !formData.tech_level}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" />
                <span>Generate with AI</span>
              </button>
            </div>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter world name..."
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Basic Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Basic Description
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief overview of your world..."
            />
          </div>

          {/* World Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone *
              </label>
              <select
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.tone}
                onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
              >
                <option value="">Select tone...</option>
                {toneOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Magic Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Magic Level *
              </label>
              <select
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.magic_level}
                onChange={(e) => setFormData(prev => ({ ...prev, magic_level: e.target.value }))}
              >
                <option value="">Select magic level...</option>
                {magicLevelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tech Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tech Level *
              </label>
              <select
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.tech_level}
                onChange={(e) => setFormData(prev => ({ ...prev, tech_level: e.target.value }))}
              >
                <option value="">Select tech level...</option>
                {techLevelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Multi-select sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Authority Structure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Authority Structure (Choose multiple)
              </label>
              <div className="space-y-2">
                {authorityStructureOptions.map(option => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      checked={formData.authority_structure.includes(option)}
                      onChange={() => handleCheckboxChange('authority_structure', option)}
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Daily Life Pressures */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Daily Life Pressures (Choose multiple)
              </label>
              <div className="space-y-2">
                {dailyLifePressuresOptions.map(option => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      checked={formData.daily_life_pressures.includes(option)}
                      onChange={() => handleCheckboxChange('daily_life_pressures', option)}
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* General Description & Style */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                General Description & Style
              </label>
              <button
                type="button"
                onClick={generateDescriptionWithAI}
                disabled={loading || !formData.tone || !formData.magic_level || !formData.tech_level}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" />
                <span>Generate with AI</span>
              </button>
            </div>
            <textarea
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              value={formData.general_description_style}
              onChange={(e) => setFormData(prev => ({ ...prev, general_description_style: e.target.value }))}
              placeholder="This sets the main context for building components with AI. Describe the overall style, themes, and atmosphere of your world..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? (editingWorld ? 'Updating...' : 'Creating...') : (editingWorld ? 'Update World' : 'Create World')}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Select World</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New World</span>
        </button>
      </div>

      {worlds.length === 0 ? (
        <div className="text-center py-8">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No worlds created yet</p>
          <p className="text-sm text-gray-500">Create your first world to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {worlds.map((world) => (
            <div
              key={world.id}
              onClick={() => onWorldSelect(world)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                currentWorld?.id === world.id
                  ? 'border-purple-200 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{world.name}</h3>
                  {world.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                      {world.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Created {new Date(world.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => handleEdit(e, world)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, world.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}