import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useWorlds } from './hooks/useWorlds';
import { useComponents } from './hooks/useComponents';
import { useDarkMode } from './hooks/useDarkMode';
import LoginScreen from './components/LoginScreen';
import WorldSelector from './components/WorldSelector';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ComponentList from './components/ComponentList';
import Settings from './components/Settings';
import RegionForm from './components/forms/RegionForm';
import GovernmentForm from './components/forms/GovernmentForm';
import CharacterForm from './components/forms/CharacterForm';
import GeographicalFeatureForm from './components/forms/GeographicalFeatureForm';
import SiteForm from './components/forms/SiteForm';
import AdventureForm from './components/forms/AdventureForm';
import HistoryForm from './components/forms/HistoryForm';
import MonsterForm from './components/forms/MonsterForm';

function App() {
  const { user, loading: authLoading, signInWithEmail, signUpWithEmail, signOut } = useAuth();
  const { worlds, currentWorld, setCurrentWorld, createWorld, deleteWorld, updateWorld } = useWorlds();
  const { isDarkMode } = useDarkMode();
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [showForm, setShowForm] = useState<string | null>(null);
  const [authLoading2, setAuthLoading2] = useState(false);
  const [showWorldSelector, setShowWorldSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Get components for the current world
  const { components: regions, createComponent: createRegion, deleteComponent: deleteRegion } = useComponents('regions', currentWorld?.id || null);
  const { components: governments, createComponent: createGovernment, deleteComponent: deleteGovernment } = useComponents('governments', currentWorld?.id || null);
  const { components: characters, createComponent: createCharacter, deleteComponent: deleteCharacter } = useComponents('characters', currentWorld?.id || null);
  const { components: geographical, createComponent: createGeographical, deleteComponent: deleteGeographical } = useComponents('geographical', currentWorld?.id || null);
  const { components: sites, createComponent: createSite, deleteComponent: deleteSite } = useComponents('sites', currentWorld?.id || null);
  const { components: adventures, createComponent: createAdventure, deleteComponent: deleteAdventure } = useComponents('adventures', currentWorld?.id || null);
  const { components: history, createComponent: createHistory, deleteComponent: deleteHistory } = useComponents('history', currentWorld?.id || null);
  const { components: monsters, createComponent: createMonster, deleteComponent: deleteMonster } = useComponents('monsters', currentWorld?.id || null);
  const { components: items } = useComponents('items', currentWorld?.id || null);
  const { components: settlements } = useComponents('settlements', currentWorld?.id || null);

  const allComponents = {
    regions,
    governments,
    geographical,
    sites,
    adventures,
    characters,
    history,
    monsters,
    items,
    settlements
  };

  const componentCounts = {
    regions: regions.length,
    governments: governments.length,
    geographical: geographical.length,
    sites: sites.length,
    adventures: adventures.length,
    characters: characters.length,
    history: history.length,
    monsters: monsters.length,
    items: items.length,
    settlements: settlements.length
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 dark:border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (email: string, password: string, isSignUp: boolean) => {
    setAuthLoading2(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading2(false);
    }
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} loading={authLoading2} />;
  }

  if (!currentWorld) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header 
          user={{ 
            name: user.user_metadata?.display_name || user.user_metadata?.full_name || 'User', 
            email: user.email || '' 
          }}
          onLogout={signOut}
          onSettings={() => setShowSettings(true)}
        />
        <div className="max-w-2xl mx-auto pt-16 px-4">
          <WorldSelector
            worlds={worlds}
            currentWorld={currentWorld}
            onWorldSelect={setCurrentWorld}
            onWorldCreate={createWorld}
            onWorldDelete={deleteWorld}
            onWorldEdit={updateWorld}
          />
        </div>
      </div>
    );
  }

  const handleNewComponent = (type: string) => {
    setShowForm(type);
  };

  const handleSaveComponent = async (type: string, data: any) => {
    try {
      switch (type) {
        case 'regions':
          await createRegion(data);
          break;
        case 'governments':
          await createGovernment(data);
          break;
        case 'characters':
          await createCharacter(data);
          break;
        case 'geographical':
          await createGeographical(data);
          break;
        case 'sites':
          await createSite(data);
          break;
        case 'adventures':
          await createAdventure(data);
          break;
        case 'history':
          await createHistory(data);
          break;
        case 'monsters':
          await createMonster(data);
          break;
        default:
          console.warn(`Component type ${type} not implemented yet`);
      }
    } catch (error) {
      console.error('Failed to save component:', error);
      throw error;
    }
    setShowForm(null);
  };

  const handleDeleteComponent = (type: string, id: string) => {
    switch (type) {
      case 'regions':
        deleteRegion(id);
        break;
      case 'governments':
        deleteGovernment(id);
        break;
      case 'characters':
        deleteCharacter(id);
        break;
      case 'geographical':
        deleteGeographical(id);
        break;
      case 'sites':
        deleteSite(id);
        break;
      case 'adventures':
        deleteAdventure(id);
        break;
      case 'history':
        deleteHistory(id);
        break;
      default:
        console.warn(`Delete for component type ${type} not implemented yet`);
    }
  };

  const getComponentTitle = (type: string) => {
    const titles: { [key: string]: string } = {
      regions: 'Regions',
      governments: 'Governments',
      geographical: 'Geographical Features',
      sites: 'Sites',
      adventures: 'Adventures',
      characters: 'Characters',
      history: 'History',
      monsters: 'Monsters',
      items: 'Items',
      settlements: 'Settlements'
    };
    return titles[type] || type;
  };

  const getEmptyMessage = (type: string) => {
    const messages: { [key: string]: string } = {
      regions: 'Create your first region to start building your world.',
      governments: 'Add governments to bring political structure to your world.',
      geographical: 'Design natural features that shape your world\'s landscape.',
      sites: 'Build important locations where adventures can unfold.',
      adventures: 'Plan exciting quests and storylines for your world.',
      characters: 'Populate your world with memorable NPCs and important figures.',
      history: 'Chronicle the events that shaped your world.',
      monsters: 'Create creatures that inhabit your world\'s wild places.',
      items: 'Design magical artifacts and useful equipment.',
      settlements: 'Build cities, towns, and villages where people live.'
    };
    return messages[type] || `Create your first ${type}.`;
  };

  const renderForm = () => {
    switch (showForm) {
      case 'regions':
        return (
          <RegionForm
            worldId={currentWorld.id}
            worldContext={currentWorld.general_description_style || ''}
            onClose={() => setShowForm(null)}
            onSave={(data) => handleSaveComponent('regions', data)}
          />
        );
      case 'governments':
        return (
          <GovernmentForm
            worldId={currentWorld.id}
            worldContext={currentWorld.general_description_style || ''}
            onClose={() => setShowForm(null)}
            onSave={(data) => handleSaveComponent('governments', data)}
          />
        );
      case 'characters':
        return (
          <CharacterForm
            worldId={currentWorld.id}
            worldContext={currentWorld.general_description_style || ''}
            onClose={() => setShowForm(null)}
            onSave={(data) => handleSaveComponent('characters', data)}
          />
        );
      case 'geographical':
        return (
          <GeographicalFeatureForm
            worldId={currentWorld.id}
            worldContext={currentWorld.general_description_style || ''}
            onClose={() => setShowForm(null)}
            onSave={(data) => handleSaveComponent('geographical', data)}
          />
        );
      case 'sites':
        return (
          <SiteForm
            worldId={currentWorld.id}
            worldContext={currentWorld.general_description_style || ''}
            onClose={() => setShowForm(null)}
            onSave={(data) => handleSaveComponent('sites', data)}
          />
        );
      case 'adventures':
        return (
          <AdventureForm
            worldId={currentWorld.id}
            worldContext={currentWorld.general_description_style || ''}
            onClose={() => setShowForm(null)}
            onSave={(data) => handleSaveComponent('adventures', data)}
          />
        );
      case 'history':
        return (
          <HistoryForm
            worldId={currentWorld.id}
            worldContext={currentWorld.general_description_style || ''}
            onClose={() => setShowForm(null)}
            onSave={(data) => handleSaveComponent('history', data)}
          />
        );
      case 'monsters':
        return (
          <MonsterForm
            worldId={currentWorld.id}
            worldContext={currentWorld.general_description_style || ''}
            onClose={() => setShowForm(null)}
            onSave={(data) => handleSaveComponent('monsters', data)}
          />
        );
      default:
        return null;
    }
  };

  const renderMainContent = () => {
    if (activeComponent === 'dashboard') {
      return (
        <Dashboard
          worldName={currentWorld.name}
          onComponentSelect={setActiveComponent}
          componentCounts={componentCounts}
          worlds={worlds}
          currentWorld={currentWorld}
          onWorldSelect={setCurrentWorld}
          onWorldEdit={() => setShowWorldSelector(true)}
        />
      );
    }

    return (
      <ComponentList
        title={getComponentTitle(activeComponent)}
        components={allComponents[activeComponent as keyof typeof allComponents] || []}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => handleDeleteComponent(activeComponent, id)}
        emptyMessage={getEmptyMessage(activeComponent)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        user={{ 
          name: user.user_metadata?.display_name || user.user_metadata?.full_name || 'User', 
          email: user.email || '' 
        }}
        onLogout={signOut}
        onSettings={() => setShowSettings(true)}
      />
      
      <div className="flex">
        <Sidebar
          activeComponent={activeComponent}
          onComponentSelect={setActiveComponent}
          onNewComponent={handleNewComponent}
          componentCounts={componentCounts}
        />
        
        <main className="flex-1 p-8">
          {renderMainContent()}
        </main>
      </div>

      {showForm && renderForm()}
      
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
      
      {showWorldSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full mx-4">
            <WorldSelector
              worlds={worlds}
              currentWorld={currentWorld}
              onWorldSelect={(world) => {
                setCurrentWorld(world);
                setShowWorldSelector(false);
              }}
              onWorldCreate={async (worldData) => {
                const newWorld = await createWorld(worldData);
                setShowWorldSelector(false);
                return newWorld;
              }}
              onWorldDelete={deleteWorld}
              onWorldEdit={updateWorld}
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowWorldSelector(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;