const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY, {
  apiVersion: 'v1' // Change from v1beta to v1
});