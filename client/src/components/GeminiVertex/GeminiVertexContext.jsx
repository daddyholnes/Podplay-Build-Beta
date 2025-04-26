import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create the context
const GeminiVertexContext = createContext();

// Custom hook to use the context
export const useGeminiVertexContext = () => useContext(GeminiVertexContext);

// Provider component
export const GeminiVertexProvider = ({ children }) => {
  // State for model selection
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(''); // Initialize as empty string
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // State for handling errors

  // State for parameters
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(8192);
  const [topP, setTopP] = useState(0.95);
  const [topK, setTopK] = useState(40);

  // State for RAG
  const [useRAG, setUseRAG] = useState(false);
  const [documents, setDocuments] = useState([]); // Ensure documents have { id, title, content } structure

  // State for chat
  const [messages, setMessages] = useState([]);

  // Fetch available models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      setIsLoadingModels(true);
      setError(null); // Clear previous errors
      try {
        const response = await fetch('/api/vertex/models');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.models && data.models.length > 0) {
          setAvailableModels(data.models);
          // Set the default selected model *after* models are loaded
          setSelectedModel(data.models[0]?.id || ''); // Select the first model's ID
        } else {
          setAvailableModels([]); // Set empty if no models found
          setSelectedModel('');
          console.warn('No models received from the API.');
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        setError(`Failed to fetch models: ${error.message}`);
        setAvailableModels([]); // Ensure models list is empty on error
        setSelectedModel('');
      } finally {
        setIsLoadingModels(false);
      }
    };

    fetchModels();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to generate content
  const generateContent = useCallback(async (prompt) => {
    if (!selectedModel) {
      setError('No model selected. Please choose a model from the list.');
      console.error('No model selected');
      return; // Exit if no model is selected
    }
    if (!prompt || prompt.trim() === '') {
        setError('Prompt cannot be empty.');
        return;
    }


    setIsLoading(true);
    setError(null); // Clear previous errors

    // Add user message immediately for better UX
    const userMessage = { role: 'user', content: prompt };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      const response = await fetch('/api/vertex/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel, // Send the selected model ID
          prompt,
          options: {
            temperature,
            maxOutputTokens: maxTokens,
            topP,
            topK,
          },
          // Send documents only if RAG is enabled
          documents: useRAG ? documents : [],
          useRAG: useRAG // Explicitly send the RAG flag
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Throw an error with details from the backend response
        throw new Error(data.details || `API error: ${response.status}`);
      }

      // Add the AI response to the chat
      const assistantMessage = { role: 'assistant', content: data.response };
      // Update messages state correctly by replacing the last user message
      // and adding the assistant message. Or simply add the assistant message.
      setMessages(prevMessages => [...prevMessages, assistantMessage]);

      return data.response; // Return the generated content
    } catch (error) {
      console.error('Error generating content:', error);
      setError(`Error generating content: ${error.message}`);
      // Optionally remove the user message if generation failed critically
      // setMessages(prevMessages => prevMessages.slice(0, -1));
      // Add an error message to the chat
       const errorMessage = { role: 'assistant', content: `Error: ${error.message}` };
       setMessages(prevMessages => [...prevMessages, errorMessage]);
      // Re-throw the error if you need to handle it further up the component tree
      // throw error;
    } finally {
      setIsLoading(false);
    }
  }, [selectedModel, temperature, maxTokens, topP, topK, useRAG, documents]); // Add dependencies

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    setError(null); // Clear errors when clearing chat
  };

  // Context value
  const value = {
    availableModels,
    selectedModel,
    setSelectedModel,
    isLoadingModels, // Expose loading state for models
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
    topP,
    setTopP,
    topK,
    setTopK,
    useRAG,
    setUseRAG,
    documents,
    setDocuments, // Ensure you have functions to add/remove/update documents
    messages,
    setMessages,
    isLoading, // Expose loading state for generation
    generateContent,
    clearChat,
    error, // Expose error state
    setError // Allow components to clear errors
  };

  return (
    <GeminiVertexContext.Provider value={value}>
      {children}
    </GeminiVertexContext.Provider>
  );
};

// Export the context itself if needed elsewhere, though usually the hook is sufficient
// export default GeminiVertexContext;