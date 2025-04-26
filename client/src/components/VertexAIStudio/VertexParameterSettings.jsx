import React from 'react';
import { Slider } from '~/components/ui/Slider';
import { Label } from '~/components/ui/Label';
import { Input } from '~/components/ui/Input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/Tooltip';
import { InfoCircledIcon } from '@radix-ui/react-icons';

export default function VertexParameterSettings({ parameters, setParameters }) {
  const handleParameterChange = (param, value) => {
    setParameters(prev => ({ ...prev, [param]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center mb-2">
          <Label htmlFor="temperature" className="mr-2">Temperature</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Controls randomness: Lower values are more deterministic, higher values more creative.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <Slider
            id="temperature"
            min={0}
            max={1}
            step={0.01}
            value={[parameters.temperature]}
            onValueChange={([value]) => handleParameterChange('temperature', value)}
            className="flex-1"
          />
          <Input
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={parameters.temperature}
            onChange={(e) => handleParameterChange('temperature', parseFloat(e.target.value))}
            className="w-16"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Label htmlFor="maxOutputTokens" className="mr-2">Max Output Tokens</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Maximum number of tokens to generate in the response.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <Slider
            id="maxOutputTokens"
            min={1}
            max={8192}
            step={1}
            value={[parameters.maxOutputTokens]}
            onValueChange={([value]) => handleParameterChange('maxOutputTokens', value)}
            className="flex-1"
          />
          <Input
            type="number"
            min={1}
            max={8192}
            step={1}
            value={parameters.maxOutputTokens}
            onChange={(e) => handleParameterChange('maxOutputTokens', parseInt(e.target.value))}
            className="w-20"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Label htmlFor="topP" className="mr-2">Top P</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Nucleus sampling: Only consider tokens with top_p cumulative probability.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <Slider
            id="topP"
            min={0}
            max={1}
            step={0.01}
            value={[parameters.topP]}
            onValueChange={([value]) => handleParameterChange('topP', value)}
            className="flex-1"
          />
          <Input
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={parameters.topP}
            onChange={(e) => handleParameterChange('topP', parseFloat(e.target.value))}
            className="w-16"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Label htmlFor="topK" className="mr-2">Top K</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Only consider the top k tokens for sampling.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <Slider
            id="topK"
            min={1}
            max={100}
            step={1}
            value={[parameters.topK]}
            onValueChange={([value]) => handleParameterChange('topK', value)}
            className="flex-1"
          />
          <Input
            type="number"
            min={1}
            max={100}
            step={1}
            value={parameters.topK}
            onChange={(e) => handleParameterChange('topK', parseInt(e.target.value))}
            className="w-16"
          />
        </div>
      </div>
    </div>
  );
}