const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 3000;

// The flag that participants need to capture

// Allowed domains for admin access
const ALLOWED_ADMIN_DOMAINS = ['admin.com'];

app.use(cors({
  origin: '*'
}));

app.use(express.json());

// Middleware to check if request is from admin domain
const checkAdminDomain = (req, res, next) => {
  const host = req.headers.host;
  
  // Vulnerable check: Only validates if host ends with allowed domain
  const isAdminDomain = ALLOWED_ADMIN_DOMAINS.some(domain => 
    host && host.endsWith(domain)
  );

  if (isAdminDomain) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin domain required.' });
  }
};

// Public endpoint
app.get('/api/public', (req, res) => {
  res.json({ message: 'Welcome User!' });
});

// Admin endpoint (vulnerable to Host header manipulation)
app.get('/api/admin', checkAdminDomain, (req, res) => {
  res.json({ 
    message: 'Welcome, admin!',
    flag: process.env.FLAG
  });
});

app.get('/', (req, res)=> {
  res.send('welcome');
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});