import React, { useState } from 'react';

const GeminiStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await fetch('/api/vertex/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await result.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h1 className="text-2xl font-bold mb-4">Gemini API Studio</h1>

      <div className="flex flex-1">
        <div className="w-1/2 pr-2">
          <h2 className="text-lg font-medium mb-2">Prompt</h2>
          <textarea
            className="w-full h-64 p-2 border rounded-md"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
          />
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="w-1/2 pl-2">
          <h2 className="text-lg font-medium mb-2">Response</h2>
          <div className="w-full h-64 p-2 border rounded-md overflow-auto">
            {response || 'Response will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiStudio;