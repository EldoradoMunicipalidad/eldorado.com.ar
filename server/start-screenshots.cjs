const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('./db.cjs');
const app = express();
app.use(cors());
app.use(express.json());
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
const habilitacionesRouter = require('./routes/habilitaciones.cjs');
app.use('/api/habilitaciones', habilitacionesRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(distPath, 'index.html'));
});
const PORT = process.env.PORT || 3099;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  // Keep alive by logging periodically
  setInterval(() => {}, 60000);
});
