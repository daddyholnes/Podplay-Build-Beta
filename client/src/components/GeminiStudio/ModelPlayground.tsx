// ModelPlayground.tsx
import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import ResponseViewer from './ResponseViewer';

const ModelPlayground: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [apiCode, setApiCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const generateApiCode = (model, prompt, params) => {
    return `
const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex AI
const vertexAi = new VertexAI({
  project: '${process.env.GOOGLE_PROJECT_ID}',
  location: 'us-central1',
});

// Get the model
const generativeModel = vertexAi.preview.getGenerativeModel({
  model: '${model}',
  generation_config: ${JSON.stringify(params, null, 2)}
});

async function generateContent() {
  const result = await generativeModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: \`${prompt}\` }] }],
  });
  
  console.log(result.response.candidates[0].content.parts[0].text);
}

generateContent();
    `;
  };
  
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
      
      // Generate API code sample
      setApiCode(generateApiCode('gemini-flash-2.0', prompt, {
        temperature: 0.7,
        max_output_tokens: 8192
      }));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex">
        <div className="w-1/2 p-4 border-r">
          <h3 className="text-lg font-medium mb-2">Prompt</h3>
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
        
        <div className="w-1/2 p-4">
          <h3 className="text-lg font-medium mb-2">Response</h3>
          <ResponseViewer response={response} isLoading={isLoading} />
        </div>
      </div>
      
      <div className="mt-4 p-4 border-t">
        <h3 className="text-lg font-medium mb-2">API Code</h3>
        <CodeEditor code={apiCode} language="javascript" />
      </div>
    </div>
  );
};