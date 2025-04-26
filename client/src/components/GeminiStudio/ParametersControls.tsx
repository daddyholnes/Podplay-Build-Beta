// ParameterControls.tsx
import React, { useState } from 'react';
import Slider from './Slider';

const ParameterControls: React.FC = () => {
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.95);
  const [topK, setTopK] = useState(40);
  const [maxOutputTokens, setMaxOutputTokens] = useState(8192);
  
  return (
    <div className="mt-6">
      <h3 className="text-md font-medium mb-4">Generation Parameters</h3>
      
      <div className="space-y-4">
        <Slider
          label="Temperature"
          value={temperature}
          onChange={setTemperature}
          min={0}
          max={1}
          step={0.01}
          tooltip="Controls randomness: Lower values are more deterministic, higher values more creative"
        />
        
        <Slider
          label="Top P"
          value={topP}
          onChange={setTopP}
          min={0}
          max={1}
          step={0.01}
          tooltip="Controls diversity via nucleus sampling: 0.5 means half of probability mass"
        />
        
        <Slider
          label="Top K"
          value={topK}
          onChange={setTopK}
          min={1}
          max={100}
          step={1}
          tooltip="Limits vocabulary to top K tokens at each step"
        />
        
        <Slider
          label="Max Output Tokens"
          value={maxOutputTokens}
          onChange={setMaxOutputTokens}
          min={1}
          max={8192}
          step={1}
          tooltip="Maximum number of tokens to generate"
        />
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
        <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">Parameter Presets</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          <button className="px-3 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
            Creative
          </button>
          <button className="px-3 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
            Balanced
          </button>
          <button className="px-3 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
            Precise
          </button>
        </div>
      </div>
    </div>
  );
};