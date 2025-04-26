import React, { useState } from 'react';
import { useGeminiVertexContext } from './GeminiVertexContext';
import ModelSelector from './ModelSelector';
import ParameterSettings from './ParameterSettings';
import RAGPanel from './RAGPanel';
import { Label } from '~/components/ui/Label';
import { Button } from '~/components/ui/Button';
import { Textarea } from '~/components/ui/Textarea';
import { Card, CardContent } from '~/components/ui/Card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/Accordion';
import { CircleLoader } from 'react-spinners';
import { ArrowRight, AlertTriangle, GanttChartSquare, Sparkles } from 'lucide-react';
import { EModelEndpoint } from 'podplay-build-data-provider';

export default function GeminiVertexTab() {
  const { 
    isEnabled, 
    loading, 
    error, 
    selectedModel, 
    temperature,
    maxTokens,
    topP,
    topK,
    useRAG,
    documents
  } = useGeminiVertexContext();
  
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [generating, setGenerating] = useState(false);
  const [isError, setIsError] = useState(false);
  
  // Check if the selected model supports vision
  const isVisionModel = selectedModel?.includes('vision');
  
  // Generate content using the Gemini/Vertex API
  const generateContent = async () => {
    if (!prompt.trim()) return;
    
    setGenerating(true);
    setIsError(false);
    setResponse('');
    
    try {
      // Determine which endpoint to use
      let endpoint = '/api/gemini-vertex/generate';
      
      // If RAG is enabled, use the RAG endpoint
      if (useRAG && documents.length > 0) {
        endpoint = '/api/gemini-vertex/rag';
      }
      
      // Create the request payload
      const payload = {
        model: selectedModel,
        message: prompt,
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
        top_k: topK,
        stream: true
      };
      
      // Add documents if using RAG
      if (useRAG && documents.length > 0) {
        payload.documents = documents;
        payload.query = prompt;
      }
      
      // Make the API request
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              break;
            }
            
            try {
              const parsed = JSON.parse(data);
              result += parsed.text;
              setResponse(result);
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error generating content:', err);
      setIsError(true);
      setResponse(`Error: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    generateContent();
  };
  
  // If the endpoint is not enabled, show a message
  if (!isEnabled) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <AlertTriangle className="h-12 w-12 text-warning mb-4" />
        <h2 className="text-lg font-medium mb-2">Google API Not Configured</h2>
        <p className="text-center text-muted-foreground mb-4 max-w-md">
          The Google API endpoint is not enabled. Please configure your Google API key or service account in the LibreChat settings.
        </p>
        <Button variant="outline" onClick={() => window.open('/config', '_blank')}>
          Open Configuration
        </Button>
      </div>
    );
  }
  
  // If there's an error loading the models, show an error message
  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-lg font-medium mb-2">Error Loading Models</h2>
        <p className="text-center text-muted-foreground mb-4 max-w-md">
          {error}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex h-full flex-col p-4 md:p-8">
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center">
          <Sparkles className="h-6 w-6 mr-2 text-blue-500" />
          Gemini & Vertex AI
        </h1>
        <p className="text-muted-foreground">
          Generate content using Google's Gemini and Vertex AI models
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Settings */}
        <Card className="col-span-1">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Model selector */}
              <div>
                <Label className="mb-2 block">Model</Label>
                <ModelSelector />
              </div>
              
              {/* Advanced settings */}
              <Accordion type="single" collapsible defaultValue="parameters">
                <AccordionItem value="parameters">
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center">
                      <GanttChartSquare className="mr-2 h-4 w-4" />
                      Parameters
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ParameterSettings />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* RAG Settings */}
              <RAGPanel />
            </div>
          </CardContent>
        </Card>
        
        {/* Right column: Prompt and Response */}
        <Card className="col-span-1 lg:col-span-2">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="prompt" className="mb-2 block">Prompt</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt here..."
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!prompt.trim() || generating || loading}
                  className="flex items-center"
                >
                  {generating ? (
                    <CircleLoader size={16} color="currentColor" className="mr-2" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                  {generating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
              
              {response && (
                <div>
                  <Label className="mb-2 block">Response</Label>
                  <div 
                    className={`p-4 rounded-md border min-h-[200px] whitespace-pre-wrap ${isError ? 'border-destructive/50 bg-destructive/10' : 'bg-card'}`}
                  >
                    {response}
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}