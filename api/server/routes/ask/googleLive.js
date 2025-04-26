/**
 * Route handler for Gemini Live API requests
 * 
 * This file handles HTTP requests for the Gemini Live API endpoint,
 * routing them to the appropriate controller functions.
 */

const express = require('express');
const { initializeLiveClient, setupLiveStream } = require('~/server/services/Endpoints/google/live');
const {
  setHeaders,
  validateModel,
  validateEndpoint,
  buildEndpointOption,
} = require('~/server/middleware');
const { logger } = require('~/config');

const router = express.Router();

// Handle streaming requests for the Gemini Live API
router.post(
  '/stream',
  validateEndpoint,
  validateModel,
  buildEndpointOption,
  setHeaders,
  async (req, res, next) => {
    try {
      // Initialize the client
      const { client, modelName } = await initializeLiveClient({
        req,
        res, 
        endpointOption: req.endpointOption,
        overrideModel: req.body.model,
      });
      
      // Set up the streaming session
      await setupLiveStream({
        client,
        modelName,
        req,
        res,
        onStart: () => {
          logger.debug('[GoogleLiveRoute] Started streaming session');
        },
        onCompletion: (error, completeText) => {
          if (error) {
            logger.error('[GoogleLiveRoute] Stream error:', error);
          } else {
            logger.debug('[GoogleLiveRoute] Stream completed');
          }
        },
      });
    } catch (error) {
      logger.error('[GoogleLiveRoute] Error in stream endpoint:', error);
      
      // Only send error response if headers haven't been sent yet
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

// Handle regular (non-streaming) requests for the Gemini Live API
router.post(
  '/',
  validateEndpoint,
  validateModel,
  buildEndpointOption,
  setHeaders,
  async (req, res, next) => {
    try {
      // Initialize the client
      const { client, modelName } = await initializeLiveClient({
        req,
        res, 
        endpointOption: req.endpointOption,
        overrideModel: req.body.model,
      });
      
      // Import the completion handler dynamically to avoid circular dependencies
      const { handleLiveCompletion } = require('~/server/services/Endpoints/google/live');
      
      // Process the completion
      const result = await handleLiveCompletion({
        client,
        modelName,
        messages: req.body.messages,
        modelOptions: req.body.model_parameters || {},
      });
      
      // Send the response
      res.json(result);
    } catch (error) {
      logger.error('[GoogleLiveRoute] Error in completion endpoint:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;