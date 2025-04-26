const { GoogleAuth } = require('google-auth-library');
const path = require('path');
const fs = require('fs');

class VertexAiProvider {
  constructor() {
    // Load service account credentials
    // Ensure the path to your service account key file is correct
    const credentialsPath = path.resolve(process.cwd(), 'camera-calibration-beta-6304d1bafd3c.json');
    if (!fs.existsSync(credentialsPath)) {
      console.error(`Service account key file not found at: ${credentialsPath}`);
      // Handle the error appropriately, maybe throw or set a default state
      throw new Error('Service account key file not found.');
    }
    this.serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    // Initialize Google Auth
    this.auth = new GoogleAuth({
      credentials: this.serviceAccount,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    this.projectId = this.serviceAccount.project_id;
    // Ensure this location matches your Vertex AI resources
    this.location = 'us-central1';
  }

  async generateContent(model, prompt, options = {}, documents = []) {
    try {
      // Construct the correct API endpoint URL based on the model ID format
      // Example model ID: projects/your-project-id/locations/us-central1/publishers/google/models/gemini-1.5-flash-001
      // If the model ID is just 'gemini-1.5-flash', construct the full path
      const modelPath = model.startsWith('projects/') ? model : `projects/${this.projectId}/locations/${this.location}/publishers/google/models/${model}`;
      const url = `https://${this.location}-aiplatform.googleapis.com/v1/${modelPath}:generateContent`;

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
      if (useRAG && documents && documents.length > 0) {
        // Format context based on your document structure
        const context = documents.map(doc => `${doc.title || 'Document'}:\n${doc.content}`).join('\n\n');
        // Prepend context to the user's prompt
        requestData.contents[0].parts[0].text = `Context Information:\n${context}\n\nUser Query: ${prompt}`;
      }

      console.log('Sending request to Vertex AI:', JSON.stringify(requestData, null, 2)); // Log the request payload

      const response = await client.request({
        url,
        method: 'POST',
        data: requestData
      });

      console.log('Received response from Vertex AI:', JSON.stringify(response.data, null, 2)); // Log the response payload

      // Handle potential variations in the response structure
      if (response.data && response.data.candidates && response.data.candidates.length > 0 &&
          response.data.candidates[0].content && response.data.candidates[0].content.parts &&
          response.data.candidates[0].content.parts.length > 0) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected response structure from Vertex AI:', response.data);
        throw new Error('Failed to parse content from Vertex AI response.');
      }

    } catch (error) {
      console.error('Error generating content with Vertex AI:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
      throw error;
    }
  }

  async listModels() {
    try {
      // Use the correct API endpoint for listing models
      const url = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models`;

      const client = await this.auth.getClient();
      const response = await client.request({
        url,
        method: 'GET'
      });

      // Process the response to extract relevant model information
      if (response.data && response.data.models) {
        return response.data.models
          .filter(model =>
            model.supportedGenerationMethods.includes('generateContent') && // Ensure the model supports content generation
            (model.name.includes('gemini') || model.name.includes('text-embedding') || model.name.includes('palm')) // Filter by desired model types
          )
          .map(model => ({
            // Extract the short model ID from the full name path
            id: model.name.split('/').pop(), // e.g., 'gemini-1.5-flash-001'
            name: model.displayName || model.name.split('/').pop(), // Use displayName if available
            provider: 'google',
            fullName: model.name // Keep the full name if needed elsewhere
          }));
      } else {
        console.error('Unexpected response structure when listing models:', response.data);
        return this.getFallbackModels(); // Return fallback on unexpected structure
      }
    } catch (error) {
      console.error('Error listing Vertex AI models:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
      // Return a fallback list of models in case of API error
      return this.getFallbackModels();
    }
  }

  // Helper function for fallback models
  getFallbackModels() {
    return [
      { id: 'gemini-1.5-flash-001', name: 'Gemini 1.5 Flash', provider: 'google' },
      { id: 'gemini-1.5-pro-001', name: 'Gemini 1.5 Pro', provider: 'google' },
      { id: 'gemini-1.0-pro-001', name: 'Gemini 1.0 Pro', provider: 'google' },
      // Add other relevant models if needed
    ];
  }
}

module.exports = VertexAiProvider;
