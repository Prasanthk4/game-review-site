const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Proxy middleware configuration
app.use('/api', createProxyMiddleware({
  target: 'https://graphql.anilist.co',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/'
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
}));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port or stop the existing process.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
