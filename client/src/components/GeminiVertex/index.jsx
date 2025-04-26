import GeminiVertexTab from './GeminiVertexTab';
import { GeminiVertexProvider, useGeminiVertexContext } from './GeminiVertexContext';

export { GeminiVertexTab, GeminiVertexProvider, useGeminiVertexContext };

// Main component with context provider
export default function GeminiVertex() {
  return (
    <GeminiVertexProvider>
      <GeminiVertexTab />
    </GeminiVertexProvider>
  );
}