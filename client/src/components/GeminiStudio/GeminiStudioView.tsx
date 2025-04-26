import { useState, useRef, useEffect } from 'react';
import { EModelEndpoint } from '../../data-provider';

interface GeminiStudioViewProps {
  vertexModels: any[];
  googleConfig: any;
}

/**
 * GeminiStudioView - A specialized interface for Gemini API and Vertex AI
 * designed with neurodivergent users in mind
 */
const GeminiStudioView = ({ vertexModels, googleConfig }: GeminiStudioViewProps) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{role: string, content: string}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-pro');
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [colorMode, setColorMode] = useState('default');
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Available Gemini models
  const models = [
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'gemini-pro-vision', name: 'Gemini Pro Vision' },
    { id: 'gemini-ultra', name: 'Gemini Ultra (if available)' },
    ...vertexModels.map(model => ({ id: model.id, name: model.name || model.id }))
  ];

  // Accessibility color schemes designed for neurodivergent users
  const colorSchemes = {
    default: {
      background: 'bg-white dark:bg-gray-900',
      message: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-black dark:text-white',
    },
    gentle: {
      background: 'bg-blue-50 dark:bg-slate-900',
      message: 'bg-blue-100 dark:bg-slate-800',
      text: 'text-slate-900 dark:text-blue-50',
    },
    calm: {
      background: 'bg-green-50 dark:bg-gray-900',
      message: 'bg-green-100 dark:bg-gray-800',
      text: 'text-gray-900 dark:text-green-50',
    },
    focus: {
      background: 'bg-amber-50 dark:bg-gray-950',
      message: 'bg-amber-100 dark:bg-gray-900',
      text: 'text-gray-900 dark:text-amber-50',
    },
  };
  
  const currentScheme = colorSchemes[colorMode as keyof typeof colorSchemes] || colorSchemes.default;
  
  useEffect(() => {
    // Scroll to bottom when conversation updates
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  }, [conversation, reducedMotion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;
    
    const userMessage = { role: 'user', content: message };
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsProcessing(true);
    
    try {
      // Send request to LibreChat's Google endpoint
      const response = await fetch('/api/chat/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [...conversation, userMessage],
          endpoint: EModelEndpoint.google
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const result = await response.json();
      if (result?.choices?.[0]?.message) {
        setConversation(prev => [...prev, result.choices[0].message]);
      } else {
        // Fallback for error handling
        setConversation(prev => [...prev, { role: 'assistant', content: 'Sorry, I was unable to process your request. Please try again.' }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setConversation(prev => [...prev, { role: 'assistant', content: 'Sorry, an error occurred. Please try again.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderMessageWithSensoryConsiderations = (content: string) => {
    // Process content for neurodivergent users (e.g. highlighting important parts)
    return content.split('\n').map((line, i) => (
      <p key={i} className="mb-2">
        {line}
      </p>
    ));
  };

  return (
    <div 
      className={`flex flex-col h-full ${currentScheme.background} transition-colors duration-200`}
      style={{ fontSize: `${fontSize}px`, lineHeight: lineSpacing }}
    >
      {/* Accessibility Controls */}
      <div className="p-2 border-b flex flex-wrap items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center">
          <label htmlFor="model-select" className="mr-2 text-sm font-medium">Model:</label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-white dark:bg-gray-700 border rounded px-2 py-1 text-sm"
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center">
          <label htmlFor="font-size" className="mr-2 text-sm font-medium">Font Size:</label>
          <input
            id="font-size"
            type="range"
            min="14"
            max="24"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-24"
          />
        </div>
        
        <div className="flex items-center">
          <label htmlFor="color-scheme" className="mr-2 text-sm font-medium">Color Scheme:</label>
          <select
            id="color-scheme"
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value)}
            className="bg-white dark:bg-gray-700 border rounded px-2 py-1 text-sm"
          >
            <option value="default">Default</option>
            <option value="gentle">Gentle (Blue)</option>
            <option value="calm">Calm (Green)</option>
            <option value="focus">Focus (Amber)</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            id="high-contrast"
            type="checkbox"
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
            className="mr-1"
          />
          <label htmlFor="high-contrast" className="mr-3 text-sm">High Contrast</label>
          
          <input
            id="reduced-motion"
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => setReducedMotion(e.target.checked)}
            className="mr-1"
          />
          <label htmlFor="reduced-motion" className="text-sm">Reduced Motion</label>
        </div>
      </div>
      
      {/* Conversation View */}
      <div className="flex-1 overflow-y-auto p-4" style={{ paddingBottom: '120px' }}>
        {conversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <svg className="w-16 h-16 mb-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <h2 className="text-xl font-medium mb-2">Welcome to Gemini Studio</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              This is a specialized interface designed for neurodivergent users.
              You can adjust the visual settings using the controls above.
            </p>
          </div>
        ) : (
          conversation.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 rounded-lg p-4 max-w-4xl mx-auto ${
                msg.role === 'user' 
                  ? `ml-auto ${highContrast ? 'bg-blue-200 dark:bg-blue-900' : 'bg-blue-100 dark:bg-blue-800'}`
                  : `${highContrast ? 'bg-gray-200 dark:bg-gray-700' : currentScheme.message}`
              } ${highContrast ? 'border-2 border-gray-400 dark:border-gray-500' : ''}`}
              style={{ 
                fontSize: `${fontSize}px`,
                lineHeight: lineSpacing,
                boxShadow: highContrast ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              <div className="font-medium mb-2">
                {msg.role === 'user' ? 'You' : 'Gemini'}
              </div>
              <div className={`${currentScheme.text}`}>
                {renderMessageWithSensoryConsiderations(msg.content)}
              </div>
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-4 border-t fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className={`flex-1 p-3 rounded-lg border ${highContrast ? 'border-2 border-black dark:border-white' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              rows={2}
              disabled={isProcessing}
              style={{ fontSize: `${fontSize}px` }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isProcessing || !message.trim()}
              className={`px-4 py-2 rounded-lg ${
                isProcessing || !message.trim()
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                  : `bg-blue-500 hover:bg-blue-600 ${highContrast ? 'text-white font-bold' : 'text-white'}`
              } transition-colors`}
              style={{ minWidth: '80px', fontSize: `${fontSize}px` }}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeminiStudioView;