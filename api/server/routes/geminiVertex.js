const express = require('express');
const router = express.Router();
const geminiVertexController = require('~/server/controllers/GeminiVertexController');

// Regular content generation endpoint
router.post('/generate', geminiVertexController.generateContent);

// Chat completion with history
router.post('/chat', geminiVertexController.chatCompletion);

// Function calling endpoint
router.post('/function', geminiVertexController.functionCalling);

// Get available models
router.get('/models', geminiVertexController.getModels);

// RAG (Retrieval Augmented Generation) endpoint
router.post('/rag', geminiVertexController.ragQuery);

// Agent creation and management
router.post('/agent', geminiVertexController.createAgent);

// Vertex AI specific endpoints
router.post('/vertex/:endpoint', geminiVertexController.vertexEndpoint);

module.exports = router;