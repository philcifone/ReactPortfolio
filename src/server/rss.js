// server/rss.js
const { Feed } = require('feed');
const db = require('./database');
const marked = require('marked'); // For converting markdown to HTML
const sanitizeHtml = require('sanitize-html'); // For sanitizing HTML content

const generateRSSFeed = async () => {
  const siteURL = process.env.SITE_URL || 'https://philcifone.com';
  
  const feed = new Feed({
    title: "Phil Cifone's Blog",
    description: "Digital Preservation Reimagined: Crafting Open Solutions for Tomorrow's Archives",
    id: siteURL,
    link: siteURL,
    language: "en",
    image: `${siteURL}/logo.png`,
    favicon: `${siteURL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Phil Cifone`,
    generator: "Custom RSS Feed Generator",
    feedLinks: {
      rss2: `${siteURL}/rss.xml`,
      json: `${siteURL}/feed.json`,
      atom: `${siteURL}/atom.xml`
    },
    author: {
      name: "Phil Cifone",
      email: "phil@philcifone.com",
      link: siteURL
    }
  });

  return new Promise((resolve, reject) => {
    // Get all published posts ordered by creation date
    db.all(`
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT 20
    `, (err, posts) => {
      if (err) {
        reject(err);
        return;
      }

      posts.forEach(post => {
        // Parse tags
        const tags = post.tags ? 
          post.tags.split(',').map(tag => tag.trim()).filter(Boolean) : 
          [];

        // Convert markdown content to HTML and sanitize
        const contentHtml = sanitizeHtml(marked.parse(post.content), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'title']
          }
        });

        // Create absolute URLs for images
        const processedContent = contentHtml.replace(
          /(src|href)="\/([^"]+)"/g, 
          `$1="${siteURL}/$2"`
        );

        feed.addItem({
          title: post.title,
          id: `${siteURL}/blog/${post.id}`,
          link: `${siteURL}/blog/${post.id}`,
          description: post.excerpt || post.content.substring(0, 200) + '...',
          content: processedContent,
          author: [{
            name: "Phil Cifone",
            email: "phil@philcifone.com",
            link: siteURL
          }],
          date: new Date(post.created_at),
          image: post.image_path ? `${siteURL}${post.image_path}` : undefined,
          category: tags.map(tag => ({ name: tag })),
          published: new Date(post.created_at),
          updated: new Date(post.updated_at || post.created_at)
        });
      });

      resolve(feed);
    });
  });
};

// Export different feed formats
module.exports = {
  generateRSSFeed,
  async getRssFeed() {
    const feed = await generateRSSFeed();
    return feed.rss2();
  },
  async getAtomFeed() {
    const feed = await generateRSSFeed();
    return feed.atom1();
  },
  async getJsonFeed() {
    const feed = await generateRSSFeed();
    return feed.json1();
  }
};