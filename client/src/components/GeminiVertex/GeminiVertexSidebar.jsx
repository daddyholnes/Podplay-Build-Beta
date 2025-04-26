import React, { useState } from 'react';

/**
 * Sidebar component for configuring Gemini/Vertex settings
 */
const GeminiVertexSidebar = ({
  model,
  setModel,
  availableModels,
  tools,
  setTools,
  ragSettings,
  setRagSettings,
  vertexSettings,
  setVertexSettings,
}) => {
  const [activeTab, setActiveTab] = useState('models');

  return (
    <div className="w-72 border-l border-gray-300 dark:border-gray-700 overflow-hidden flex flex-col">
      <div className="border-b border-gray-300 dark:border-gray-700">
        <div className="flex">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === 'models'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('models')}
          >
            Models
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === 'tools'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('tools')}
          >
            Tools
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === 'rag'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('rag')}
          >
            RAG
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'models' && (
          <div>
            <h3 className="text-sm font-medium mb-2">Select Model</h3>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              {availableModels.length === 0 ? (
                <option value="">Loading models...</option>
              ) : (
                availableModels.map((modelName) => (
                  <option key={modelName} value={modelName}>
                    {modelName}
                  </option>
                ))
              )}
            </select>

            <h3 className="text-sm font-medium mt-4 mb-2">Vertex AI Settings</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={vertexSettings.useServiceAccount}
                  onChange={(e) =>
                    setVertexSettings({
                      ...vertexSettings,
                      useServiceAccount: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                Use Service Account
              </label>
              
              <div>
                <label className="block text-xs mb-1">Location</label>
                <input
                  type="text"
                  value={vertexSettings.location}
                  onChange={(e) =>
                    setVertexSettings({
                      ...vertexSettings,
                      location: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  placeholder="us-central1"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div>
            <h3 className="text-sm font-medium mb-2">Function Calling</h3>
            <div className="space-y-4">
              {tools.map((tool, index) => (
                <div key={index} className="border border-gray-300 dark:border-gray-600 rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{tool.name}</h4>
                    <button
                      onClick={() => {
                        const updatedTools = [...tools];
                        updatedTools.splice(index, 1);
                        setTools(updatedTools);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                    {JSON.stringify(tool, null, 2)}
                  </pre>
                </div>
              ))}

              <button
                onClick={() => {
                  const name = prompt('Enter function name:');
                  if (name) {
                    setTools([
                      ...tools,
                      {
                        name,
                        description: prompt('Enter function description:') || '',
                        parameters: {
                          type: 'object',
                          properties: {},
                          required: [],
                        },
                      },
                    ]);
                  }
                }}
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Add Function
              </button>
            </div>
          </div>
        )}

        {activeTab === 'rag' && (
          <div>
            <h3 className="text-sm font-medium mb-2">RAG Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={ragSettings.enabled}
                  onChange={(e) =>
                    setRagSettings({
                      ...ragSettings,
                      enabled: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                Enable RAG
              </label>

              {ragSettings.enabled && (
                <>
                  <h4 className="text-xs font-medium">Documents</h4>
                  {ragSettings.documents.map((doc, index) => (
                    <div key={index} className="border border-gray-300 dark:border-gray-600 rounded-md p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium truncate max-w-[180px]">
                          {doc.title || `Document ${index + 1}`}
                        </span>
                        <button
                          onClick={() => {
                            const updatedDocs = [...ragSettings.documents];
                            updatedDocs.splice(index, 1);
                            setRagSettings({
                              ...ragSettings,
                              documents: updatedDocs,
                            });
                          }}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {doc.content.substring(0, 50)}...
                      </p>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const title = prompt('Document title:');
                      const content = prompt('Document content:');
                      
                      if (content) {
                        setRagSettings({
                          ...ragSettings,
                          documents: [
                            ...ragSettings.documents,
                            { title, content },
                          ],
                        });
                      }
                    }}
                    className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                  >
                    Add Document
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiVertexSidebar;