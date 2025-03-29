import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current file directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.get('/indexbooking.html', (req, res) => {
  res.sendFile(join(__dirname, 'indexbooking.html'));
});

app.get('/hotels', (req, res) => {
  res.sendFile(join(__dirname, 'hotels.html'));
});

app.get('/Main.html', (req, res) => {
  res.sendFile(join(__dirname, 'Main.html'));
});

app.get('/newpage.html', (req, res) => {
  res.sendFile(join(__dirname, 'newpage.html'));
});

// Add route for admin section
app.get('/admin/index.php', (req, res) => {
  res.sendFile(join(__dirname, 'admin/index.php'));
});

// Handle any requests with spaces in URL (like 'Admin Click')
app.get('*', (req, res, next) => {
  // Check if URL contains encoded spaces
  if (req.url.includes('%20')) {
    // Decode the URL and redirect to the correct path
    const decodedUrl = decodeURIComponent(req.url);
    return res.redirect(decodedUrl.replace(/ /g, ''));
  }
  next();
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
