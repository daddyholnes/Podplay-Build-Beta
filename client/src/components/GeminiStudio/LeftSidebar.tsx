// LeftSidebar.tsx
import React from 'react';
import ChatHistory from './ChatHistory';
import PromptLibrary from './PromptLibrary';
import ProjectFolder from './ProjectFolder';

const LeftSidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-64 bg-[#f8f9fa] dark:bg-[#202124] border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium">Podplay Builder</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <ChatHistory />
        <PromptLibrary />
        <ProjectFolder />
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">
          New Chat
        </button>
      </div>
    </div>
  );
};