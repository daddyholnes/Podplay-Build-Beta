// server/utils/AiProviders/vertexAi/index.js
const { GoogleAuth } = require('google-auth-library');
const { VertexAI } = require('@google-cloud/vertexai');

class VertexAiProvider {
  constructor(embedder = null, modelPreference = null) {
    // Load service account credentials
    const serviceAccount = require('../../../../camera-calibration-beta-6304d1bafd3c.json');
    
    // Initialize Google Auth
    this.auth = new GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    // Initialize Vertex AI
    this.vertexAi = new VertexAI({
      project: serviceAccount.project_id,
      location: 'us-central1',
      auth: this.auth
    });
    
    // Get Gemini model
    this.generativeModel = this.vertexAi.preview.getGenerativeModel({
      model: modelPreference || 'gemini-flash-2.0',
      generation_config: {
        temperature: 0.7,
        top_p: 0.95,
        top_k: 40,
        max_output_tokens: 8192,
      }
    });
    
    this.embedder = embedder;
  }
  
  async generateContent(prompt, options = {}) {
    try {
      const result = await this.generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        ...options
      });
      
      return result.response.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error generating content with Vertex AI:', error);
      throw error;
    }
  }
  
  async streamGenerateContent(prompt, options = {}) {
    try {
      const streamingResult = await this.generativeModel.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        ...options
      });
      
      return streamingResult;
    } catch (error) {
      console.error('Error streaming content with Vertex AI:', error);
      throw error;
    }
  }
  
  async embedText(text) {
    // Implement embedding functionality using Vertex AI
    // or delegate to the provided embedder
    if (this.embedder) {
      return this.embedder.embedText(text);
    }
    
    // Fallback to Vertex AI embedding
    // Implementation depends on specific Vertex AI embedding model
  }
}

module.exports = VertexAiProvider;