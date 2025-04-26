const fs = require('fs');
const path = require('path');
const { EModelEndpoint } = require('podplay-build-data-provider');
const { logger } = require('~/config');

const endpoint = EModelEndpoint.google;

/**
 * Parse the Google service account key from a JSON file
 * @param {string} filepath - Path to the service account JSON file
 * @returns {object|null} - The parsed service account key or null if not found
 */
function parseServiceAccountKey(filepath) {
  try {
    if (!fs.existsSync(filepath)) {
      return null;
    }
    
    const serviceAccountKey = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    return serviceAccountKey;
  } catch (error) {
    logger.error(`Error parsing Google service account key: ${error.message}`);
    return null;
  }
}

/**
 * Get configuration for Google models
 * @returns {Promise<{googleApiKey: string, vertexAiCredentials: object}>} - Configuration for Google models
 */
async function getGoogleModelsConfig() {
  try {
    // Use the updated API key
    const googleApiKey = 'AIzaSyAej4Gac0Wl3GF5H6lIy11QxKoS_Zezfv4';
    
    // Get the path to the service account JSON file
    const serviceAccountPath = path.join(process.cwd(), 'camera-calibration-beta-6304d1bafd3c.json');
    const vertexAiCredentials = parseServiceAccountKey(serviceAccountPath);
    
    if (!googleApiKey && !vertexAiCredentials) {
      logger.warn(
        'Neither Google API key nor Vertex AI service account credentials found. Google models will not be available.',
      );
      return null;
    }

    return {
      googleApiKey,
      vertexAiCredentials
    };
  } catch (error) {
    logger.error(`Error getting Google models config: ${error.message}`);
    return null;
  }
}

/**
 * Get available models from Google API
 * @returns {Promise<Array>} - Array of available models
 */
async function getModels() {
  try {
    const googleConfig = await getGoogleModelsConfig();
    
    if (!googleConfig) {
      logger.warn('Google API configuration not found');
      return [];
    }
    
    // Define default models
    const defaultModels = [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
      { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro (Latest)' },
      { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro' },
      { id: 'gemini-pro-vision', name: 'Gemini Pro Vision' },
    ];
    
    // If Vertex AI credentials are available, add Vertex AI models
    if (googleConfig.vertexAiCredentials) {
      defaultModels.push(
        { id: 'text-bison@002', name: 'Text Bison (Vertex)' },
        { id: 'chat-bison@002', name: 'Chat Bison (Vertex)' },
        { id: 'gemini-1.5-pro-vision', name: 'Gemini 1.5 Pro Vision (Vertex)' },
        { id: 'gemini-1.5-flash-001', name: 'Gemini 1.5 Flash (Vertex)' },
        { id: 'gemini-1.5-pro-001', name: 'Gemini 1.5 Pro (Vertex)' }
      );
    }
    
    return defaultModels.map(model => model.id);
  } catch (error) {
    logger.error(`Error getting Google models: ${error.message}`);
    return [];
  }
}

/**
 * Validates if the request is valid for the Google endpoint
 * @param {Object} req - The request object
 * @returns {boolean} - True if the request is valid
 */
async function validateGoogleEndpoint(req) {
  const { conversationId, ...endpointConfig } = req.body;
    
  // Ensure an API key or service account is configured
  const googleConfig = await getGoogleModelsConfig();
  
  if (!googleConfig) {
    req.locals = { error: { message: 'Google API is not configured' } };
    return false;
  }
  
  return true;
}

/**
 * Sets the context for the Google endpoint
 * @param {Object} req - The request object
 */
async function setGoogleContext(req) {
  const { conversationId, ...endpointConfig } = req.body;

  // Setup basic request
  req.locals = {
    endpoint,
    endpointConfig,
    conversationId,
  };

  req.locals.promptType = req.locals.endpointConfig.promptType || 'google';
  return;
}

module.exports = {
  validateGoogleEndpoint,
  setGoogleContext,
  getGoogleModelsConfig,
  getModels,
};