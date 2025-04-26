const { GoogleAuth } = require('google-auth-library');
const path = require('path');
const fs = require('fs');

class VertexAiProvider {
  constructor() {
    // Load service account credentials
    const credentialsPath = path.resolve(process.cwd(), 'camera-calibration-beta-6304d1bafd3c.json');
    this.serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    // Initialize Google Auth
    this.auth = new GoogleAuth({
      credentials: this.serviceAccount,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    this.projectId = this.serviceAccount.project_id;
    this.location = 'us-central1';
  }
  
  async generateContent(model, prompt, options = {}, documents = []) {
    try {
      const url = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${model}:generateContent`;
      
      const client = await this.auth.getClient();
      
      // Prepare the request data
      const requestData = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxOutputTokens || 8192,
          topP: options.topP || 0.95,
          topK: options.topK || 40
        }
      };
      
      // Add RAG context if documents are provided
      if (documents && documents.length > 0) {
        // Add context to the prompt
        const context = documents.map(doc => `${doc.title}:\n${doc.content}`).join('\n\n');
        requestData.contents[0].parts[0].text = `Context Information:\n${context}\n\nUser Query: ${prompt}`;
      }
      
      const response = await client.request({
        url,
        method: 'POST',
        data: requestData
      });
      
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error generating content with Vertex AI:', error);
      throw error;
    }
  }
  
  async listModels() {
    try {
      const url = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models`;
      
      const client = await this.auth.getClient();
      const response = await client.request({
        url,
        method: 'GET'
      });
      
      return response.data.models.filter(model => 
        model.name.includes('gemini') || 
        model.name.includes('text-embedding') ||
        model.name.includes('palm')
      );
    } catch (error) {
      console.error('Error listing Vertex AI models:', error);
      // Return a fallback list of models
      return [
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google' },
        { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', provider: 'google' },
        { id: 'text-embedding-gecko', name: 'Text Embedding', provider: 'google' }
      ];
    }
  }
}

module.exports = VertexAiProvider;