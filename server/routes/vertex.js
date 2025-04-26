const express = require('express');
const router = express.Router();
const VertexAiProvider = require('../utils/AiProviders/vertexAi'); // Correct path

// Initialize the Vertex AI provider
let vertexAi;
try {
  vertexAi = new VertexAiProvider();
} catch (error) {
  console.error("Failed to initialize VertexAiProvider:", error.message);
  // Optionally handle this case, e.g., by disabling routes or returning errors
}

// Generate content with Vertex AI
router.post('/generate', async (req, res) => {
  if (!vertexAi) {
    return res.status(503).json({ error: 'Vertex AI Provider not initialized. Check server logs.' });
  }
  try {
    // Destructure with defaults
    const { model, prompt, options = {}, documents = [], useRAG = false } = req.body;

    if (!model) {
      return res.status(400).json({ error: 'Model ID is required' });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Pass useRAG flag to the provider method
    const response = await vertexAi.generateContent(model, prompt, options, useRAG ? documents : []);

    res.json({ response });
  } catch (error) {
    console.error('API Error in /generate:', error);
    // Provide more specific error details if available
    const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to generate content';
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({ error: 'Failed to generate content', details: errorMessage });
  }
});

// Get available models from Vertex AI
router.get('/models', async (req, res) => {
  if (!vertexAi) {
    return res.status(503).json({ error: 'Vertex AI Provider not initialized. Check server logs.' });
  }
  try {
    const models = await vertexAi.listModels();
    res.json({ models }); // Send the models array directly
  } catch (error) {
    console.error('API Error in /models:', error);
    const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to fetch models';
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({ error: 'Failed to fetch models', details: errorMessage });
  }
});

module.exports = router;