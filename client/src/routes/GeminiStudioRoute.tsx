import { useState, useEffect } from 'react';
import GeminiStudioView from '~/components/GeminiStudio/GeminiStudioView';

/**
 * GeminiStudioRoute - Route component for the specialized Gemini Studio
 * designed for neurodivergent users
 */
const GeminiStudioRoute = () => {
  const [vertexModels, setVertexModels] = useState([]);
  const [googleConfig, setGoogleConfig] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch available Vertex AI models and configuration
    const fetchModelsAndConfig = async () => {
      try {
        // Get configuration for Google models
        const configResponse = await fetch('/api/endpoints/config/override');
        if (configResponse.ok) {
          const configData = await configResponse.json();
          if (configData.google) {
            setGoogleConfig(configData.google);
          }
        }
        
        // Attempt to get Vertex AI models if available
        try {
          const vertexResponse = await fetch('/api/google/models/vertex');
          if (vertexResponse.ok) {
            const vertexData = await vertexResponse.json();
            if (Array.isArray(vertexData.models)) {
              setVertexModels(vertexData.models);
            }
          }
        } catch (vertexError) {
          console.log('Vertex AI models not available:', vertexError);
        }
      } catch (error) {
        console.error('Error fetching models or config:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModelsAndConfig();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Loading Gemini Studio...</p>
        </div>
      </div>
    );
  }
  
  return <GeminiStudioView vertexModels={vertexModels} googleConfig={googleConfig} />;
};

export default GeminiStudioRoute;