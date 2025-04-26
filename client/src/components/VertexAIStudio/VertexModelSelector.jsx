import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';

const VERTEX_MODELS = [
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
  { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro' },
  { id: 'gemini-1.0-pro-vision', name: 'Gemini 1.0 Pro Vision' },
  { id: 'text-bison', name: 'Text Bison' },
  { id: 'code-bison', name: 'Code Bison' },
  { id: 'imagen-3', name: 'Imagen 3' },
  { id: 'chirp', name: 'Chirp (Speech)' }
];

export default function VertexModelSelector({ selectedModel, setSelectedModel }) {
  return (
    <div className="w-64">
      <Select value={selectedModel} onValueChange={setSelectedModel}>
        <SelectTrigger>
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {VERTEX_MODELS.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}