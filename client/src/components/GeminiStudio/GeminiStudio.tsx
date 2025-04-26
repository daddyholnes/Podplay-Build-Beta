// GeminiStudio.tsx
import React from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import ChatInterface from './ChatInterface';

const GeminiStudio: React.FC = () => {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <LeftSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
          <h1 className="text-xl font-semibold">Gemini API Studio</h1>
        </header>
        
        <ChatInterface />
      </div>
      
      <RightSidebar />
    </div>
  );
};