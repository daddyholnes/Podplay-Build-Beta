const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAuth } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');
const { getGoogleModelsConfig } = require('~/server/services/GoogleService');
const { logger } = require('~/config');

/**
 * Controller for handling Gemini and Vertex AI API requests
 */
class GeminiVertexController {
  /**
   * Get available models from Gemini and Vertex AI
   */
  async getModels(req, res) {
    try {
      // Get the configuration for Google API access
      const config = await getGoogleModelsConfig();
      
      // Check if Google API is configured
      if (!config || (!config.googleApiKey && !config.vertexAiCredentials)) {
        return res.status(400).json({
          message: 'Google API is not configured. Please set up your API key or service account.',
          models: []
        });
      }
      
      // Initialize the models array
      let models = [];
      
      // If Google API Key is configured, get Gemini models
      if (config.googleApiKey) {
        try {
          // Define basic Gemini models available with API key
          const geminiModels = [
            'gemini-1.5-pro',
            'gemini-1.5-flash',
            'gemini-1.5-pro-latest',
            'gemini-1.0-pro',
            'gemini-pro-vision'
          ];
          
          models = [...models, ...geminiModels];
        } catch (err) {
          logger.error('Error fetching Gemini models:', err);
        }
      }
      
      // If Vertex AI credentials are configured, get Vertex AI models
      if (config.vertexAiCredentials) {
        try {
          // Define available Vertex AI models
          const vertexModels = [
            'text-bison@002',
            'chat-bison@002',
            'gemini-1.5-pro-vision',
            'gemini-1.5-flash-001',
            'gemini-1.5-pro-001'
          ];
          
          models = [...models, ...vertexModels];
        } catch (err) {
          logger.error('Error fetching Vertex AI models:', err);
        }
      }
      
      // Remove duplicates and ensure unique model names
      models = [...new Set(models)];
      
      res.json({
        models,
        isServiceAccount: !!config.vertexAiCredentials
      });
    } catch (error) {
      logger.error('Error in getModels:', error);
      res.status(500).json({
        message: 'Failed to fetch models',
        error: error.message
      });
    }
  }

  /**
   * Generate content with Gemini
   */
  async generateContent(req, res) {
    try {
      const { model, message, temperature = 0.7, max_tokens: maxTokens = 2048, top_p: topP = 0.8, top_k: topK = 40, stream = true } = req.body;
      
      // Get the configuration for Google API access
      const config = await getGoogleModelsConfig();
      
      // Check if Google API is configured
      if (!config || (!config.googleApiKey && !config.vertexAiCredentials)) {
        return res.status(400).json({
          message: 'Google API is not configured.'
        });
      }
      
      // Set up headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Use Google API key for Gemini models
      if (config.googleApiKey) {
        const genAI = new GoogleGenerativeAI(config.googleApiKey);
        const geminiModel = genAI.getGenerativeModel({
          model,
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
            topP,
            topK
          }
        });
        
        try {
          // Start generation with streaming
          const result = await geminiModel.generateContentStream(message);
          
          // Stream the response
          for await (const chunk of result.stream) {
            const text = chunk.text();
            const data = JSON.stringify({ text });
            res.write(`data: ${data}\n\n`);
          }
          
          // End the stream
          res.write('data: [DONE]\n\n');
          res.end();
        } catch (err) {
          logger.error('Error generating content with Gemini:', err);
          
          // Send error as an event
          const errorMessage = JSON.stringify({
            error: true,
            text: `Error: ${err.message}`
          });
          
          res.write(`data: ${errorMessage}\n\n`);
          res.end();
        }
      } else {
        // No API configuration available
        const errorMessage = JSON.stringify({
          error: true,
          text: 'No valid Google API configuration found.'
        });
        
        res.write(`data: ${errorMessage}\n\n`);
        res.end();
      }
    } catch (error) {
      logger.error('Error in generateContent:', error);
      
      // Handle unexpected errors
      try {
        const errorMessage = JSON.stringify({
          error: true,
          text: `Unexpected error: ${error.message}`
        });
        
        res.write(`data: ${errorMessage}\n\n`);
        res.end();
      } catch (e) {
        // If we can't write to the response, it might be already closed
        logger.error('Failed to send error response:', e);
      }
    }
  }

  /**
   * Chat completion endpoint for multi-turn conversations
   */
  async chatCompletion(req, res) {
    try {
      const { model, messages, temperature = 0.7, max_tokens: maxTokens = 2048, top_p: topP = 0.8, top_k: topK = 40 } = req.body;
      
      // Get the configuration for Google API access
      const config = await getGoogleModelsConfig();
      
      // Check if Google API is configured
      if (!config || (!config.googleApiKey && !config.vertexAiCredentials)) {
        return res.status(400).json({
          message: 'Google API is not configured.'
        });
      }
      
      // Set up headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Format the messages in the chat format expected by Google's API
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      
      // Use Google API key for Gemini models
      if (config.googleApiKey) {
        const genAI = new GoogleGenerativeAI(config.googleApiKey);
        const geminiModel = genAI.getGenerativeModel({
          model,
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
            topP,
            topK
          }
        });
        
        try {
          // Create a chat session
          const chat = geminiModel.startChat({ history: formattedMessages.slice(0, -1) });
          
          // Send the last message and stream the response
          const result = await chat.sendMessageStream(formattedMessages[formattedMessages.length - 1].parts[0].text);
          
          // Stream the response
          for await (const chunk of result.stream) {
            const text = chunk.text();
            const data = JSON.stringify({ text });
            res.write(`data: ${data}\n\n`);
          }
          
          // End the stream
          res.write('data: [DONE]\n\n');
          res.end();
        } catch (err) {
          logger.error('Error in chat completion with Gemini:', err);
          
          // Send error as an event
          const errorMessage = JSON.stringify({
            error: true,
            text: `Error: ${err.message}`
          });
          
          res.write(`data: ${errorMessage}\n\n`);
          res.end();
        }
      } else {
        // No API configuration available
        const errorMessage = JSON.stringify({
          error: true,
          text: 'No valid Google API configuration found.'
        });
        
        res.write(`data: ${errorMessage}\n\n`);
        res.end();
      }
    } catch (error) {
      logger.error('Error in chatCompletion:', error);
      
      // Handle unexpected errors
      try {
        const errorMessage = JSON.stringify({
          error: true,
          text: `Unexpected error: ${error.message}`
        });
        
        res.write(`data: ${errorMessage}\n\n`);
        res.end();
      } catch (e) {
        // If we can't write to the response, it might be already closed
        logger.error('Failed to send error response:', e);
      }
    }
  }

  /**
   * RAG (Retrieval Augmented Generation) query with document context
   */
  async ragQuery(req, res) {
    try {
      const { model, query, documents, temperature = 0.7, max_tokens: maxTokens = 2048, top_p: topP = 0.8, top_k: topK = 40 } = req.body;
      
      // Get the configuration for Google API access
      const config = await getGoogleModelsConfig();
      
      // Check if Google API is configured
      if (!config || (!config.googleApiKey && !config.vertexAiCredentials)) {
        return res.status(400).json({
          message: 'Google API is not configured.'
        });
      }
      
      // If no documents provided, return an error
      if (!documents || documents.length === 0) {
        return res.status(400).json({
          message: 'No documents provided for RAG query.'
        });
      }
      
      // Set up headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Format the documents into a context string
      const context = documents.map(doc => `Document: ${doc.title}\nContent: ${doc.content}`).join('\n\n');
      
      // Construct a prompt with the context and query
      const ragPrompt = `
Context information:
${context}

Given the context information and not prior knowledge, answer the following query:
${query}

Answer:
`;
      
      // Use Google API key for Gemini models
      if (config.googleApiKey) {
        const genAI = new GoogleGenerativeAI(config.googleApiKey);
        const geminiModel = genAI.getGenerativeModel({
          model,
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
            topP,
            topK
          }
        });
        
        try {
          // Start generation with streaming
          const result = await geminiModel.generateContentStream(ragPrompt);
          
          // Stream the response
          for await (const chunk of result.stream) {
            const text = chunk.text();
            const data = JSON.stringify({ text });
            res.write(`data: ${data}\n\n`);
          }
          
          // End the stream
          res.write('data: [DONE]\n\n');
          res.end();
        } catch (err) {
          logger.error('Error in RAG query with Gemini:', err);
          
          // Send error as an event
          const errorMessage = JSON.stringify({
            error: true,
            text: `Error: ${err.message}`
          });
          
          res.write(`data: ${errorMessage}\n\n`);
          res.end();
        }
      } else {
        // No API configuration available
        const errorMessage = JSON.stringify({
          error: true,
          text: 'No valid Google API configuration found.'
        });
        
        res.write(`data: ${errorMessage}\n\n`);
        res.end();
      }
    } catch (error) {
      logger.error('Error in ragQuery:', error);
      
      // Handle unexpected errors
      try {
        const errorMessage = JSON.stringify({
          error: true,
          text: `Unexpected error: ${error.message}`
        });
        
        res.write(`data: ${errorMessage}\n\n`);
        res.end();
      } catch (e) {
        // If we can't write to the response, it might be already closed
        logger.error('Failed to send error response:', e);
      }
    }
  }

  /**
   * Function calling with Gemini
   */
  async functionCalling(req, res) {
    try {
      const { model, message, functions, temperature = 0.7, max_tokens: maxTokens = 2048 } = req.body;
      
      // Get the configuration for Google API access
      const config = await getGoogleModelsConfig();
      
      // Check if Google API is configured
      if (!config || (!config.googleApiKey && !config.vertexAiCredentials)) {
        return res.status(400).json({
          message: 'Google API is not configured.'
        });
      }
      
      // Only allow function calling with Gemini models
      if (!model.includes('gemini')) {
        return res.status(400).json({
          message: 'Function calling is only supported with Gemini models.'
        });
      }
      
      // Set up headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Use Google API key for Gemini models
      if (config.googleApiKey) {
        const genAI = new GoogleGenerativeAI(config.googleApiKey);
        const geminiModel = genAI.getGenerativeModel({
          model,
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens
          }
        });
        
        try {
          // Convert functions to Google's tool format
          const tools = functions.map(func => ({
            functionDeclarations: [{
              name: func.name,
              description: func.description,
              parameters: {
                type: 'object',
                properties: func.parameters.properties,
                required: func.parameters.required
              }
            }]
          }));
          
          // Start generation with function calling
          const result = await geminiModel.generateContent({
            contents: [{ role: 'user', parts: [{ text: message }] }],
            tools
          });
          
          const response = result.response;
          
          // Check for function calls
          if (response.candidates?.[0]?.content?.parts?.[0]?.functionCall) {
            const functionCall = response.candidates[0].content.parts[0].functionCall;
            
            // Send the function call as a response
            const data = JSON.stringify({
              functionCall: {
                name: functionCall.name,
                arguments: JSON.parse(functionCall.args)
              }
            });
            
            res.write(`data: ${data}\n\n`);
          } else {
            // Send the text response
            const text = response.text();
            const data = JSON.stringify({ text });
            res.write(`data: ${data}\n\n`);
          }
          
          // End the stream
          res.write('data: [DONE]\n\n');
          res.end();
        } catch (err) {
          logger.error('Error in function calling with Gemini:', err);
          
          // Send error as an event
          const errorMessage = JSON.stringify({
            error: true,
            text: `Error: ${err.message}`
          });
          
          res.write(`data: ${errorMessage}\n\n`);
          res.end();
        }
      } else {
        // No API key available
        const errorMessage = JSON.stringify({
          error: true,
          text: 'Google API key is required for function calling.'
        });
        
        res.write(`data: ${errorMessage}\n\n`);
        res.end();
      }
    } catch (error) {
      logger.error('Error in functionCalling:', error);
      
      // Handle unexpected errors
      try {
        const errorMessage = JSON.stringify({
          error: true,
          text: `Unexpected error: ${error.message}`
        });
        
        res.write(`data: ${errorMessage}\n\n`);
        res.end();
      } catch (e) {
        // If we can't write to the response, it might be already closed
        logger.error('Failed to send error response:', e);
      }
    }
  }

  /**
   * Create an agent using Gemini or Vertex AI
   * This is a placeholder for future implementation
   */
  async createAgent(req, res) {
    try {
      // This is a placeholder for future implementation
      res.status(501).json({
        message: 'Agent creation is not yet implemented.'
      });
    } catch (error) {
      logger.error('Error in createAgent:', error);
      res.status(500).json({
        message: 'Failed to create agent',
        error: error.message
      });
    }
  }

  /**
   * Generic endpoint for Vertex AI-specific operations
   * This is a placeholder for future implementation
   */
  async vertexEndpoint(req, res) {
    try {
      const endpoint = req.params.endpoint;
      
      // This is a placeholder for future implementation
      res.status(501).json({
        message: `Vertex AI endpoint "${endpoint}" is not yet implemented.`
      });
    } catch (error) {
      logger.error('Error in vertexEndpoint:', error);
      res.status(500).json({
        message: 'Failed to execute Vertex AI endpoint',
        error: error.message
      });
    }
  }
}

module.exports = new GeminiVertexController();