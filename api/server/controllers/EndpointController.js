const { getEndpointsConfig } = require('~/server/services/Config');
const { EModelEndpoint } = require('librechat-data-provider');

async function endpointController(req, res) {
  const endpointsConfig = await getEndpointsConfig(req);
  
  // Force-enable the Google endpoint
  if (endpointsConfig && !endpointsConfig.google) {
    console.log('Explicitly enabling Google/Gemini endpoint via controller override');
    endpointsConfig.google = true;
  }
  
  res.send(JSON.stringify(endpointsConfig));
}

module.exports = endpointController;
