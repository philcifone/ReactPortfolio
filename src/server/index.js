const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Add this right after to debug
console.log('Current directory:', __dirname);
console.log('Looking for .env in:', path.resolve(__dirname, '../../.env'));
console.log('Environment variables:', {
  JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
  NODE_ENV: process.env.NODE_ENV,
});

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');   
const authenticateToken = require('./middleware/auth');
const multer = require('multer');
const db = require('./database');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.set('trust proxy', 1);

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

app.post('/api/posts', authenticateToken, upload.single('image'), async (req, res) => {
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


// Delete a post
app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
    console.log('=== Delete Request received ===');
    console.log('Post ID:', req.params.id);
    
    const postId = req.params.id;
    
    try {
      // Delete post tags first
      await new Promise((resolve, reject) => {
        db.run('DELETE FROM post_tags WHERE post_id = ?', [postId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
  
      // Then delete the post
      await new Promise((resolve, reject) => {
        db.run('DELETE FROM posts WHERE id = ?', [postId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
  
      return res.status(200).json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({
        error: true,
        message: error.message
      });
    }
  });
  
// Update a post
app.put('/api/posts/:id', authenticateToken, upload.single('image'), async (req, res) => {
    console.log('=== Update Request received ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    try {
      const postId = req.params.id;
      const { title, content, excerpt, tags } = req.body;
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  
      // Update the post first
      const updateQuery = imagePath
        ? 'UPDATE posts SET title = ?, content = ?, excerpt = ?, image_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        : 'UPDATE posts SET title = ?, content = ?, excerpt = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      
      const updateParams = imagePath
        ? [title, content, excerpt, imagePath, postId]
        : [title, content, excerpt, postId];
  
      await new Promise((resolve, reject) => {
        db.run(updateQuery, updateParams, function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
  
      // Delete existing tags
      await new Promise((resolve, reject) => {
        db.run('DELETE FROM post_tags WHERE post_id = ?', [postId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
  
      // Handle new tags if they exist
      if (tags) {
        console.log('Received tags:', tags);
        // Handle both string and array formats
        let tagArray;
        try {
          // First try to parse as JSON in case it's a stringified array
          tagArray = typeof tags === 'string' ? tags.split(',') : tags;
          console.log('Initial tag array:', tagArray);
          
          // Clean the tags
          tagArray = tagArray
            .map(tag => tag.trim())
            .filter(tag => tag && !tag.includes('[') && !tag.includes(']'));
          
          console.log('Processed tag array:', tagArray);
  
          // Insert tags sequentially
          for (const tag of tagArray) {
            await new Promise((resolve, reject) => {
              // First insert or get the tag
              db.run('INSERT OR IGNORE INTO tags (name) VALUES (?)', [tag], function(err) {
                if (err) {
                  reject(err);
                  return;
                }
                
                // Get the tag_id whether it was just inserted or already existed
                db.get('SELECT id FROM tags WHERE name = ?', [tag], (err, row) => {
                  if (err) {
                    reject(err);
                    return;
                  }
                  
                  // Use INSERT OR IGNORE for the post_tags relation
                  db.run('INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)',
                    [postId, row.id], (err) => {
                      if (err) reject(err);
                      else resolve();
                    });
                });
              });
            });
          }
        } catch (error) {
          console.error('Error processing tags:', error);
          // Continue with the update even if tag processing fails
        }
      }
  
      return res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        postId: postId
      });
      
    } catch (error) {
      console.error('Update error:', error);
      return res.status(500).json({
        error: true,
        message: error.message
      });
    }
  });

// Handle React Router by sending all non-API routes to index.html
app.get('/*', function(req, res) {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }
});

// Auth Routes
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Get user from database
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
      
      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid password' });
      }
      
      // Create token
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the API at http://localhost:${PORT}/api/test`);
});