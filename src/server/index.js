// server/index.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./database');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.get('/api/posts', (req, res) => {
  db.all(`
    SELECT 
      p.*,
      GROUP_CONCAT(t.name) as tags
    FROM posts p
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => ({
      ...row,
      tags: row.tags ? row.tags.split(',') : []
    })));
  });
});

app.post('/api/posts', upload.single('image'), async (req, res) => {
    console.log('=== Request received ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
  
    try {
      const { title, content, excerpt, tags } = req.body;
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  
      // Insert the post first
      db.run(`
        INSERT INTO posts (title, content, excerpt, image_path)
        VALUES (?, ?, ?, ?)
      `, [title, content, excerpt, imagePath], function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ 
            error: true, 
            message: err.message 
          });
        }
        
        const postId = this.lastID;
        
        // Handle tags if they exist
        if (tags && tags.trim()) {
          // Split tags by comma and trim
          const tagArray = tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
  
          console.log('Processing tags:', tagArray);
  
          // Insert tags sequentially
          let tagsProcessed = 0;
          tagArray.forEach(tag => {
            db.run('INSERT OR IGNORE INTO tags (name) VALUES (?)', [tag], function(err) {
              if (err) {
                console.error('Tag insertion error:', err);
                return;
              }
              
              // Link tag to post
              db.run('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)', 
                [postId, this.lastID || this.changes], (err) => {
                  if (err) {
                    console.error('Tag linking error:', err);
                  }
                  
                  tagsProcessed++;
                  // Only send response after all tags are processed
                  if (tagsProcessed === tagArray.length) {
                    return res.status(200).json({
                      success: true,
                      message: 'Post created successfully',
                      postId: postId
                    });
                  }
                });
            });
          });
          
          // If no tags to process, send response immediately
          if (tagArray.length === 0) {
            return res.status(200).json({
              success: true,
              message: 'Post created successfully',
              postId: postId
            });
          }
        } else {
          // No tags to process, send response immediately
          return res.status(200).json({
            success: true,
            message: 'Post created successfully',
            postId: postId
          });
        }
      });
    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({
        error: true,
        message: error.message
      });
    }
  });

  // Add this route to your existing routes in index.js
app.get('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    
    db.get(`
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [postId], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (!row) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
  
      // Convert tags string to array
      res.json({
        ...row,
        tags: row.tags ? row.tags.split(',') : []
      });
    });
  });

// Handle React Router by sending all non-API routes to index.html
app.get('/*', function(req, res) {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the API at http://localhost:${PORT}/api/test`);
});