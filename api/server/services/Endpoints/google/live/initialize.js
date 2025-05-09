/**
 * Initialize the Gemini Live API client
 * 
 * This module handles the initialization of the Gemini Live API client
 * with the appropriate configurations for real-time streaming conversations.
 */

const { AuthKeys, EModelEndpoint } = require('podplay-build-data-provider');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getUserKey, checkUserKeyExpiry } = require('~/server/services/UserService');
const { logger } = require('~/config');

/**
 * Initializes a Gemini Live API client with the provided credentials and options
 * 
 * @param {Object} options - Configuration options
 * @param {Object} options.req - Express request object
 * @param {string} options.model - The model identifier (e.g., 'gemini-2.0-flash-live-001')
 * @param {Object} options.modelOptions - Model-specific parameters
 * @returns {Object} - An initialized Gemini Live API client
 */
const initializeLiveClient = async ({ req, res, endpointOption, overrideModel }) => {
  const { GOOGLE_KEY, GOOGLE_REVERSE_PROXY, GOOGLE_AUTH_HEADER } = process.env;
  const isUserProvided = GOOGLE_KEY === 'user_provided';
  const { key: expiresAt } = req.body;

  let userKey = null;
  if (expiresAt && isUserProvided) {
    checkUserKeyExpiry(expiresAt, EModelEndpoint.google);
    userKey = await getUserKey({ userId: req.user.id, name: EModelEndpoint.google });
  }

  // Get API key from environment or user-provided key
  const apiKey = isUserProvided ? userKey : GOOGLE_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key is required for Gemini Live API');
  }

  const modelName = overrideModel || endpointOption.modelOptions?.model || 'gemini-2.0-flash-live-001';
  
  try {
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey, {
      apiVersion: 'v1beta', // Required for Live API support
    });

    // Validate that the model is a Live API compatible model
    if (!modelName.includes('live')) {
      logger.warn(`Model ${modelName} may not be compatible with Live API. Recommended models: gemini-2.0-flash-live-001, gemini-2.0-pro-live-001`);
    }

    logger.debug(`[GoogleLiveClient] Initialized with model: ${modelName}`);

    return {
      client: genAI,
      modelName,
      apiKey,
    };
  } catch (error) {
    logger.error('[GoogleLiveClient] Failed to initialize Gemini Live client', error);
    throw error;
  }
};

module.exports = initializeLiveClient;