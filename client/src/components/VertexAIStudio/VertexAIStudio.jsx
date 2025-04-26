import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Card, CardContent } from '~/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/Tabs';
import { Button } from '~/components/ui/Button';
import { Textarea } from '~/components/ui/Textarea';
import { Label } from '~/components/ui/Label';
import { Input } from '~/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { Loader2, Send, Image, Mic, Code, FileText, Play } from 'lucide-react';
import { userInfoState } from '~/state/user';
import VertexModelSelector from './VertexModelSelector';
import VertexParameterSettings from './VertexParameterSettings';
import VertexResponsePanel from './VertexResponsePanel';
import VertexFileUpload from './VertexFileUpload';
import VertexRAGPanel from './VertexRAGPanel';

export default function VertexAIStudio() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-pro');
  const [activeTab, setActiveTab] = useState('text');
  const [files, setFiles] = useState([]);
  const [parameters, setParameters] = useState({
    temperature: 0.7,
    maxOutputTokens: 2048,
    topP: 0.95,
    topK: 40
  });
  const userInfo = useRecoilValue(userInfoState);

  const handleSendPrompt = async () => {
    if (!prompt.trim() && files.length === 0) return;
    
    setIsLoading(true);
    setResponse('');
    
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('model', selectedModel);
      formData.append('parameters', JSON.stringify(parameters));
      
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
      
      const response = await fetch('/api/vertex/generate', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        result += chunk;
        setResponse(result);
      }
    } catch (error) {
      console.error('Error sending prompt to Vertex AI:', error);
      setResponse(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Vertex AI Studio</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="mb-4">
            <CardContent className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="text">
                    <FileText className="w-4 h-4 mr-2" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="vision">
                    <Image className="w-4 h-4 mr-2" />
                    Vision
                  </TabsTrigger>
                  <TabsTrigger value="audio">
                    <Mic className="w-4 h-4 mr-2" />
                    Audio
                  </TabsTrigger>
                  <TabsTrigger value="code">
                    <Code className="w-4 h-4 mr-2" />
                    Code
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="mt-0">
                  <Textarea
                    placeholder="Enter your prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[200px] mb-4"
                  />
                </TabsContent>
                
                <TabsContent value="vision" className="mt-0">
                  <VertexFileUpload 
                    files={files} 
                    setFiles={setFiles} 
                    acceptedTypes="image/*" 
                  />
                  <Textarea
                    placeholder="Describe what you want to know about the image..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[150px] mt-4"
                  />
                </TabsContent>
                
                <TabsContent value="audio" className="mt-0">
                  <VertexFileUpload 
                    files={files} 
                    setFiles={setFiles} 
                    acceptedTypes="audio/*" 
                  />
                  <Textarea
                    placeholder="Add instructions for audio processing..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[150px] mt-4"
                  />
                </TabsContent>
                
                <TabsContent value="code" className="mt-0">
                  <Textarea
                    placeholder="Enter your code or code-related prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[200px] font-mono"
                  />
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-between items-center mt-4">
                <VertexModelSelector 
                  selectedModel={selectedModel} 
                  setSelectedModel={setSelectedModel} 
                />
                
                <Button 
                  onClick={handleSendPrompt} 
                  disabled={isLoading || (!prompt.trim() && files.length === 0)}
                  className="ml-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <VertexResponsePanel response={response} isLoading={isLoading} />
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Model Parameters</h3>
              <VertexParameterSettings 
                parameters={parameters} 
                setParameters={setParameters} 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <VertexRAGPanel />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}