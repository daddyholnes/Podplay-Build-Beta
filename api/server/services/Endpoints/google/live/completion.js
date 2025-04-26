/**
 * Gemini Live API Completion Handler
 * 
 * This module provides functionality for handling completions through 
 * the Gemini Live API, processing multimodal inputs and returning structured responses.
 */

const { logger } = require('~/config');
const { ErrorTypes } = require('librechat-data-provider');

/**
 * Processes image data in the message content
 * 
 * @param {Array|Object} content - Message content that might contain images
 * @returns {Array} - Processed parts for the Gemini API
 */
const processImageContent = (content) => {
  // Handle string content (text only)
  if (typeof content === 'string') {
    return [{ text: content }];
  }
  
  // Handle array content (potentially multimodal)
  if (Array.isArray(content)) {
    return content.map(item => {
      if (item.type === 'image_url') {
        // Process image data
        const imageUrl = item.image_url;
        if (imageUrl.url) {
          // External URL
          return { 
            inlineData: { 
              data: imageUrl.url,
              mimeType: 'url'
            } 
          };
        } else if (imageUrl.data) {
          // Base64 encoded image
          return { 
            inlineData: { 
              data: imageUrl.data,
              mimeType: imageUrl.mimeType || 'image/jpeg'
            } 
          };
        }
      }
      // Default to text
      return { text: item.text || '' };
    });
  }
  
  // Return empty content if format is unrecognized
  return [{ text: '' }];
};

/**
 * Handles a live completion request through the Gemini Live API
 * 
 * @param {Object} options - The options for generating completions
 * @param {Object} options.client - The initialized Gemini client
 * @param {Object} options.messages - Chat message history
 * @param {Object} options.modelOptions - Model configuration options
 * @returns {Promise<Object>} - The completion response
 */
const handleLiveCompletion = async ({ client, modelName, messages, modelOptions }) => {
  try {
    logger.debug('[GoogleLiveAPI] Processing completion with model:', modelName);
    
    // Create live connection config with text as the response modality
    const liveConnectConfig = {
      responseModalities: ["text"],
    };
    
    // Create a session
    const session = await client.live.connect({
      model: modelName,
      config: liveConnectConfig,
    });
    
    // Process and send all but the last message as context
    for (let i = 0; i < messages.length - 1; i++) {
      const message = messages[i];
      const isUser = message.role === 'user';
      const content = processImageContent(message.content);
      
      await session.send({
        input: { parts: content },
        role: isUser ? 'user' : 'model',
      });
    }
    
    // Process the last message to get a response
    const lastMessage = messages[messages.length - 1];
    const lastContent = processImageContent(lastMessage.content);
    
    await session.send({
      input: { parts: lastContent },
      endOfTurn: true,
    });
    
    // Receive the model's response
    const turn = session.receive();
    
    // Collect the full response
    let fullResponse = '';
    
    // Use promise for async/await compatibility
    return new Promise((resolve, reject) => {
      turn.on('data', (data) => {
        if (data.text) {
          fullResponse += data.text;
        }
      });
      
      turn.on('end', () => {
        // Close the session when done
        session.close();
        
        // Format response to match expected structure
        const response = {
          id: `gemini-live-${Date.now()}`,
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: modelName,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: fullResponse,
              },
              finish_reason: 'stop',
            },
          ],
          usage: {
            prompt_tokens: 0, // Token counting not available in Live API
            completion_tokens: 0,
            total_tokens: 0,
          },
        };
        
        resolve(response);
      });
      
      turn.on('error', (error) => {
        logger.error('[GoogleLiveAPI] Completion error:', error);
        session.close();
        reject(error);
      });
    });
  } catch (error) {
    logger.error('[GoogleLiveAPI] Error in handleLiveCompletion:', error);
    const errorMessage = `{ "type": "${ErrorTypes.GoogleError}", "info": "${
      error.message ?? 'The Google Live API failed to generate content, please try again.'
    }" }`;
    throw new Error(errorMessage);
  }
};

module.exports = {
  handleLiveCompletion,
  processImageContent,
};