import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Add detailed request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Request:`, {
    method: req.method,
    url: req.url,
    headers: req.headers
  });
  next();
});

// Explicitly handle asset files first
app.get('/TenantScanner/assets/*', (req, res, next) => {
  const filePath = path.join(__dirname, 'dist', req.url);
  console.log('Attempting to serve asset:', filePath);
  
  if (fs.existsSync(filePath)) {
    console.log('Asset exists, serving file:', filePath);
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
      console.log('Set Content-Type to application/javascript');
    }
    res.sendFile(filePath);
  } else {
    console.log('Asset not found:', filePath);
    next();
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
  }
}));

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  console.log('Fallback: Serving index.html for path:', req.url);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Current directory: ${__dirname}`);
  console.log(`Static files directory: ${path.join(__dirname, 'dist')}`);
  
  // Log the contents of the dist directory
  console.log('Contents of dist directory:');
  try {
    const distContents = fs.readdirSync(path.join(__dirname, 'dist'));
    console.log(distContents);
    
    // Log contents of assets directory if it exists
    const assetsPath = path.join(__dirname, 'dist', 'TenantScanner', 'assets');
    if (fs.existsSync(assetsPath)) {
      console.log('Contents of assets directory:');
      console.log(fs.readdirSync(assetsPath));
    }
  } catch (err) {
    console.error('Error reading dist directory:', err);
  }
}); 