/**
 * Google Gemini Live API Integration for LibreChat
 * 
 * This module provides integration with Google's Gemini 2.0 Flash Live API
 * which enables real-time, interactive conversations with support for
 * multimodal inputs (audio, images, video) and outputs.
 */

const initializeLiveClient = require('./initialize');
const setupLiveStream = require('./stream');
const { handleLiveCompletion } = require('./completion');

module.exports = {
  initializeLiveClient,
  setupLiveStream,
  handleLiveCompletion,
};