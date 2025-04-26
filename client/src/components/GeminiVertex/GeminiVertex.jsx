import React, { useState, useEffect } from 'react';
import GeminiVertexChatView from './GeminiVertexChatView';
import GeminiVertexSidebar from './GeminiVertexSidebar';
import GeminiVertexControls from './GeminiVertexControls';
import { useGeminiVertexContext, GeminiVertexProvider } from './GeminiVertexContext';

/**
 * Main GeminiVertex component that serves as the container for the Gemini/Vertex tab
 * This is the entry point for the custom tab in LibreChat
 */
const GeminiVertex = () => {
  const { 
    model, 
    setModel, 
    messages, 
    addMessage, 
    isLoading, 
    sendMessage,
    tools,
    setTools,
    ragSettings,
    setRagSettings,
    vertexSettings,
    setVertexSettings
  } = useGeminiVertexContext();

  return (
    <GeminiVertexProvider>
      <div className="flex h-full flex-col">
        <div className="flex flex-1 overflow-hidden">
          {/* Main chat area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <GeminiVertexChatView 
              messages={messages} 
              isLoading={isLoading} 
            />
            <GeminiVertexControls 
              isLoading={isLoading} 
              onSendMessage={sendMessage}
            />
          </div>
          
          {/* Sidebar with settings and tools */}
          <GeminiVertexSidebar 
            model={model}
            setModel={setModel}
            tools={tools}
            setTools={setTools}
            ragSettings={ragSettings}
            setRagSettings={setRagSettings}
            vertexSettings={vertexSettings}
            setVertexSettings={setVertexSettings}
          />
        </div>
      </div>
    </GeminiVertexProvider>
  );
};

export default GeminiVertex;
