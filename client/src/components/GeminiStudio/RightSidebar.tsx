// RightSidebar.tsx
import React from 'react';
import ModelSelector from './ModelSelector';
import ParameterControls from './ParameterControls';
import AdvancedSettings from './AdvancedSettings';

const RightSidebar: React.FC = () => {
  const models = [
    { id: 'gemini-flash-2.0', name: 'Gemini Flash 2.0', provider: 'google' },
    { id: 'podplay-gpt-4o', name: 'GPT-4o', provider: 'azure' },
    { id: 'podplay-dall-e-3', name: 'DALL-E 3', provider: 'azure' },
    { id: 'podplay-whisper', name: 'Whisper', provider: 'azure' },
    { id: 'tts-hd', name: 'TTS-HD', provider: 'azure' },
  ];

  return (
    <div className="flex flex-col h-full w-72 bg-[#f8f9fa] dark:bg-[#202124] border-l border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium">Model Settings</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <ModelSelector models={models} />
        <ParameterControls />
        <AdvancedSettings />
      </div>
    </div>
  );
};