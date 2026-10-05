import express from 'express';
import path from 'path';

const PORT = process.env.PORT || 3000;
const root = express();

// Serve static assets from dist and fallback to index.html for SPA routing.
const distPath = path.resolve(__dirname, 'dist');
root.use(express.static(distPath));

root.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

root.listen(PORT, () => {
  console.log(`Face of Creativity frontend server running on port ${PORT}`);
});
