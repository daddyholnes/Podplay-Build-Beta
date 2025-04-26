/**
 * Gemini Live API Streaming Implementation
 * 
 * This module handles the real-time streaming capabilities of the Gemini Live API,
 * allowing for bidirectional communication with support for multimodal content.
 */

const { constants } = require('librechat-data-provider');
const { sendEvent } = require('~/config');
const { logger } = require('~/config');

/**
 * Sets up a live streaming connection to the Gemini API
 * 
 * @param {Object} options - Configuration options
 * @param {Object} options.client - The initialized Gemini client
 * @param {string} options.modelName - The model ID to use (e.g., 'gemini-2.0-flash-live-001')
 * @param {Object} options.req - Express request object
 * @param {Object} options.res - Express response object
 * @param {Function} options.onStart - Callback when streaming starts
 * @param {Function} options.onCompletion - Callback when streaming completes
 * @returns {Object} - The live session object
 */
const setupLiveStream = async ({ 
  client, 
  modelName, 
  req, 
  res, 
  onStart = () => {}, 
  onCompletion = () => {} 
}) => {
  try {
    // Configure response modalities based on user preferences
    // Default to text-only for standard chat, but can be extended for audio/visual
    const responseModalities = ["text"];
    
    // Read the messages from the request body
    const { messages = [] } = req.body;

    // Create live connection config
    const liveConnectConfig = {
      responseModalities,
    };

    // Initialize the session tracking
    let isStreamComplete = false;
    let streamError = null;
    let completeText = '';

    // Set up the stream for SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    });

    // Signal the start of the streaming process
    onStart();

    logger.debug('[GoogleLiveAPI] Setting up live stream with model:', modelName);

    // Create a live session
    const session = await client.live.connect({
      model: modelName,
      config: liveConnectConfig,
    });

    // Parse previous messages to build context
    for (let i = 0; i < messages.length - 1; i++) {
      const message = messages[i];
      const isUser = message.role === 'user';
      const content = typeof message.content === 'string' 
        ? message.content 
        : message.content[0]?.text || '';
      
      // Send past messages without expecting a response (no end_of_turn)
      await session.send({
        input: content,
        role: isUser ? 'user' : 'model',
      });
    }

    // Send the final user message to trigger a response
    const lastMessage = messages[messages.length - 1];
    const lastContent = typeof lastMessage.content === 'string' 
      ? lastMessage.content 
      : lastMessage.content[0]?.text || '';
    
    await session.send({
      input: lastContent,
      endOfTurn: true,
    });

    // Set up receivers for the response
    const turn = session.receive();
    
    // Process the stream
    turn.on('data', (data) => {
      if (data.text) {
        const chunk = data.text;
        completeText += chunk;
        
        // Send the chunk to the client
        sendEvent(res, { 
          data: { text: chunk },
          event: constants.STREAM_DATA_EVENT,
        });
      }
    });

    turn.on('end', () => {
      isStreamComplete = true;
      
      // Send the end event
      sendEvent(res, { 
        data: { text: '' },
        event: constants.STREAM_END_EVENT,
      });
      
      // Close the stream
      res.end();
      
      // Cleanup the session
      session.close();
      
      // Trigger completion callback with the full text
      onCompletion(null, completeText);
    });

    turn.on('error', (error) => {
      streamError = error;
      logger.error('[GoogleLiveAPI] Stream error:', error);
      
      // Send error event
      sendEvent(res, {
        data: { error: error.message },
        event: constants.STREAM_ERROR_EVENT,
      });
      
      // End the response
      res.end();
      
      // Close the session
      session.close();
      
      // Trigger completion callback with error
      onCompletion(error);
    });

    // Return the session for potential further interaction
    return {
      session,
      isStreamComplete: () => isStreamComplete,
      getError: () => streamError,
      getCompleteText: () => completeText,
    };
  } catch (error) {
    logger.error('[GoogleLiveAPI] Setup stream error:', error);
    
    // Send error event if response is still writable
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    } else {
      sendEvent(res, {
        data: { error: error.message },
        event: constants.STREAM_ERROR_EVENT,
      });
      res.end();
    }
    
    // Trigger completion callback with error
    onCompletion(error);
    throw error;
  }
};

module.exports = setupLiveStream;