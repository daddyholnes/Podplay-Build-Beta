const express = require('express');
const router = express.Router();
const { GoogleAuth } = require('google-auth-library');
const { VertexAI } = require('@google-cloud/vertexai');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Initialize Vertex AI
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

// Create a client
const vertexai = new VertexAI({
  project: projectId,
  location: location,
});

// POST endpoint for text generation
router.post('/generate', upload.array('files', 10), async (req, res) => {
  try {
    const { prompt, model, parameters } = req.body;
    const files = req.files || [];
    
    // Parse parameters
    const parsedParams = parameters ? JSON.parse(parameters) : {};
    
    // Select the appropriate model
    let generationModel;
    if (model.startsWith('gemini')) {
      generationModel = vertexai.preview.getGenerativeModel({
        model: model,
        generationConfig: {
          temperature: parsedParams.temperature || 0.7,
          maxOutputTokens: parsedParams.maxOutputTokens || 2048,
          topP: parsedParams.topP || 0.95,
          topK: parsedParams.topK || 40,
        },
      });
    } else {
      // Handle other model types
      return res.status(400).json({ error: 'Unsupported model type' });
    }
    
    // Prepare content parts
    const contentParts = [{ text: prompt }];
    
    // Add files if present
    for (const file of files) {
      const fileContent = fs.readFileSync(file.path);
      const mimeType = file.mimetype;
      
      if (mimeType.startsWith('image/')) {
        contentParts.push({
          inlineData: {
            data: fileContent.toString('base64'),
            mimeType: mimeType
          }
        });
      }
      // Add support for other file types as needed
    }
    
    // Set up streaming
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    // Generate content with streaming
    const streamingResp = await generationModel.generateContentStream({
      contents: [{ role: 'user', parts: contentParts }],
    });
    
    for await (const chunk of streamingResp.stream) {
      if (chunk.candidates && chunk.candidates.length > 0) {
        const candidate = chunk.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          const part = candidate.content.parts[0];
          if (part.text) {
            res.write(part.text);
          }
        }
      }
    }
    
    // Clean up uploaded files
    for (const file of files) {
      fs.unlinkSync(file.path);
    }
    
    res.end();
  } catch (error) {
    console.error('Error in Vertex AI generation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Import the Vertex AI routes
const vertexRoutes = require('./routes/vertex');

// Add the route to your Express app
app.use('/api/vertex', vertexRoutes);

module.exports = router;