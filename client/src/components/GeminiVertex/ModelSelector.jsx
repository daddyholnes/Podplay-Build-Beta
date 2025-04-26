import React from 'react';
import { useGeminiVertexContext } from './GeminiVertexContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { GoogleGeminiIcon, GoogleVertexIcon } from '~/components/svg';
import { cn } from '~/utils';

export default function ModelSelector({ className }) {
  const { models, selectedModel, setSelectedModel, loading, isServiceAccount } = useGeminiVertexContext();

  const getModelIcon = (model) => {
    // Return appropriate icon based on model type
    if (model.includes('vertex') || model.includes('bison') || model.includes('gecko')) {
      return <GoogleVertexIcon className="size-4 mr-2" />;
    }
    return <GoogleGeminiIcon className="size-4 mr-2" />;
  };

  const getModelLabel = (model) => {
    // Format model name for display
    if (model.includes('@')) {
      // Vertex AI model format: text-bison@002
      const [name, version] = model.split('@');
      return `${name} (v${version})`;
    }
    // Standard Gemini format
    return model;
  };

  return (
    <Select
      value={selectedModel}
      onValueChange={setSelectedModel}
      disabled={loading || models.length === 0}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder="Select a model">
          <div className="flex items-center">
            {selectedModel && getModelIcon(selectedModel)}
            <span className="ml-1">{selectedModel && getModelLabel(selectedModel)}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="max-h-[300px] overflow-y-auto">
          {models.length === 0 ? (
            <SelectItem value="no-models" disabled>
              No models available
            </SelectItem>
          ) : (
            <>
              {/* Gemini models group */}
              {models.filter(m => m.includes('gemini')).length > 0 && (
                <div className="mb-2">
                  <div className="text-xs font-bold uppercase text-muted-foreground px-2 py-1.5">
                    Gemini Models
                  </div>
                  {models
                    .filter(model => model.includes('gemini'))
                    .map(model => (
                      <SelectItem key={model} value={model}>
                        <div className="flex items-center">
                          <GoogleGeminiIcon className="size-4 mr-2" />
                          {getModelLabel(model)}
                        </div>
                      </SelectItem>
                    ))}
                </div>
              )}
              
              {/* Vertex AI models group */}
              {models.filter(m => m.includes('bison') || m.includes('gecko') || m.includes('image-generator')).length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase text-muted-foreground px-2 py-1.5">
                    Vertex AI Models
                  </div>
                  {models
                    .filter(model => model.includes('bison') || model.includes('gecko') || model.includes('image-generator'))
                    .map(model => (
                      <SelectItem key={model} value={model}>
                        <div className="flex items-center">
                          <GoogleVertexIcon className="size-4 mr-2" />
                          {getModelLabel(model)}
                        </div>
                      </SelectItem>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}