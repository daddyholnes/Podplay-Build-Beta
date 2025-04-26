const express = require('express');
const router = express.Router();
const geminiVertexController = require('~/server/controllers/GeminiVertexController');

// Model retrieval
router.get('/models', geminiVertexController.getModels);

// Content generation endpoints
router.post('/generate', geminiVertexController.generateContent);
router.post('/chat', geminiVertexController.chatCompletion);
router.post('/rag', geminiVertexController.ragQuery);
router.post('/function', geminiVertexController.functionCalling);

// Agent creation (placeholder for future implementation)
router.post('/agent', geminiVertexController.createAgent);

// Vertex AI specific endpoints
router.post('/vertex/:endpoint', geminiVertexController.vertexEndpoint);

module.exports = router;