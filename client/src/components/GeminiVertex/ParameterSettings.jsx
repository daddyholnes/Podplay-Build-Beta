import React from 'react';
import { Slider } from '~/components/ui/Slider';
import { Label } from '~/components/ui/Label';
import { Input } from '~/components/ui/Input';
import { Switch } from '~/components/ui/Switch';
// Correct the import path casing for Tooltip components
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'; // Changed from Tooltip.tsx to tooltip
import { Info } from 'lucide-react';
import { useGeminiVertexContext } from './GeminiVertexContext';
import RAGPanel from './RAGPanel'; // Import the RAGPanel

const ParameterSettings = () => {
  const {
    temperature, setTemperature, 
    maxTokens, setMaxTokens, 
    topP, setTopP, 
    topK, setTopK,
    useRAG, setUseRAG
  } = useGeminiVertexContext();

  return (
    <TooltipProvider> {/* Ensure TooltipProvider wraps components using Tooltip */}
      <div className="p-4 space-y-6 border-l border-gray-300 dark:border-gray-700 h-full overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Parameters</h3>

        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="temperature" className="text-xs font-medium">
              Temperature
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 ml-1 inline-block opacity-70" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Controls randomness: Lower values make responses more focused and deterministic.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <span className="text-xs text-muted-foreground">{temperature.toFixed(2)}</span>
          </div>
          <Slider
            value={[temperature]}
            onValueChange={(value) => setTemperature(value[0])}
            min={0}
            max={1}
            step={0.01}
            className="w-full"
            aria-label="Temperature"
          />
          <Input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            min={0}
            max={1}
            step={0.01}
            className="w-full mt-1"
            aria-label="Temperature input"
          />
        </div>

        {/* Max Tokens */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="maxTokens" className="text-xs font-medium">
              Max Length
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 ml-1 inline-block opacity-70" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Maximum number of tokens to generate in the response.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <span className="text-xs text-muted-foreground">{maxTokens}</span>
          </div>
          <Slider
            value={[maxTokens]}
            onValueChange={(value) => setMaxTokens(value[0])}
            min={1}
            max={8192}
            step={1}
            className="w-full"
            aria-label="Maximum Tokens"
          />
          <Input
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
            min={1}
            max={8192}
            step={1}
            className="w-full mt-1"
            aria-label="Maximum Tokens input"
          />
        </div>

        {/* Top P */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="topP" className="text-xs font-medium">
              Top P
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 ml-1 inline-block opacity-70" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Controls diversity via nucleus sampling: 0.5 means half of likelihood weight is considered.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <span className="text-xs text-muted-foreground">{topP.toFixed(2)}</span>
          </div>
          <Slider
            value={[topP]}
            onValueChange={(value) => setTopP(value[0])}
            min={0}
            max={1}
            step={0.01}
            className="w-full"
            aria-label="Top P"
          />
          <Input
            type="number"
            value={topP}
            onChange={(e) => setTopP(parseFloat(e.target.value))}
            min={0}
            max={1}
            step={0.01}
            className="w-full mt-1"
            aria-label="Top P input"
          />
        </div>

        {/* Top K */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="topK" className="text-xs font-medium">
              Top K
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 ml-1 inline-block opacity-70" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Limits token selection to the K most likely tokens.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <span className="text-xs text-muted-foreground">{topK}</span>
          </div>
          <Slider
            value={[topK]}
            onValueChange={(value) => setTopK(value[0])}
            min={1}
            max={100}
            step={1}
            className="w-full"
            aria-label="Top K"
          />
          <Input
            type="number"
            value={topK}
            onChange={(e) => setTopK(parseInt(e.target.value, 10))}
            min={1}
            max={100}
            step={1}
            className="w-full mt-1"
            aria-label="Top K input"
          />
        </div>

        {/* RAG Toggle and Panel */}
        <div className="space-y-4 pt-4 border-t border-gray-300 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <Label htmlFor="rag-switch" className="font-semibold">
              Enable RAG (Context Documents)
            </Label>
            <Switch
              id="rag-switch"
              checked={useRAG}
              onCheckedChange={setUseRAG}
              aria-label="Enable Retrieval Augmented Generation"
            />
          </div>
          {/* Conditionally render the RAGPanel */}
          {useRAG && <RAGPanel />}
        </div>

      </div>
    </TooltipProvider>
  );
};

export default ParameterSettings;