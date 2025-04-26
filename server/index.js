const express = require('express');
const app = express();
const auth = require('./routes/auth');
const { initializeFirebase } = require('./services/FirebaseService');
const vertexRoutes = require('./routes/vertex');

app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/vertex', vertexRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));