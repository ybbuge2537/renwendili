const { executeQuery } = require('../services/dbConnection.js');

class ArticleModel {
  static async getAllArticles() {
    const sql = 'SELECT * FROM article ORDER BY create_time DESC';
    return await executeQuery(sql);
  }

  static async getArticleById(articleId) {
    const sql = 'SELECT * FROM article WHERE article_id = ?';
    const results = await executeQuery(sql, [articleId]);
    return results[0] || null;
  }

  static async incrementViews(articleId, userIdentifier = null) {
    // 获取用户标识（优先使用用户ID，否则使用IP地址）
    const identifier = userIdentifier || 'anonymous';
    
    // 检查24小时内该用户是否已浏览过此文章
    const checkSql = `
      SELECT COUNT(*) as count 
      FROM view_history 
      WHERE article_id = ? 
      AND user_identifier = ? 
      AND view_time > DATE_SUB(NOW(), INTERVAL 24 HOUR)
    `;
    const result = await executeQuery(checkSql, [articleId, identifier]);
    
    // 如果24小时内已浏览过，则不增加阅读量
    if (result[0].count > 0) {
      console.log(`用户 ${identifier} 24小时内已浏览过文章 ${articleId}，不增加阅读量`);
      const article = await this.getArticleById(articleId);
      return article;
    }
    
    // 24小时内首次浏览，增加阅读量
    const updateSql = 'UPDATE article SET views = COALESCE(views, 0) + 1 WHERE article_id = ?';
    await executeQuery(updateSql, [articleId]);
    
    // 记录浏览历史
    const insertSql = 'INSERT INTO view_history (article_id, user_identifier, view_time) VALUES (?, ?, NOW())';
    await executeQuery(insertSql, [articleId, identifier]);
    
    const updatedArticle = await this.getArticleById(articleId);
    return updatedArticle;
  }

  static async createArticle(articleData) {
    const { 
      title, 
      content, 
      author_id, 
      region_id, 
      status = 'draft', 
      coordinates_lat, 
      coordinates_lng, 
      category = 'culture', 
      tags, 
      cover_image,
      author_name = '文旅达人',
      culture_background,
      opening_hours,
      ticket_price,
      transportation,
      video_url,
      culture_tips
    } = articleData;
    
    const sql = 
      'INSERT INTO article (title, content, author_id, region_id, status, coordinates_lat, coordinates_lng, category, tags, cover_image, author_name, culture_background, opening_hours, ticket_price, transportation, video_url, culture_tips, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';
    
    const results = await executeQuery(sql, [title, content, author_id, region_id, status, coordinates_lat, coordinates_lng, category, tags, cover_image, author_name, culture_background, opening_hours, ticket_price, transportation, video_url, culture_tips]);
    const newArticle = await this.getArticleById(results.insertId);
    
    await this.createArticleVersion(newArticle.article_id, '初始创建', author_id);
    
    return newArticle;
  }

  static async updateArticle(articleId, articleData, authorId) {
    const { 
      title, 
      content, 
      region_id, 
      status, 
      coordinates_lat, 
      coordinates_lng, 
      category, 
      tags, 
      cover_image,
      author_name,
      culture_background,
      opening_hours,
      ticket_price,
      transportation,
      video_url,
      culture_tips
    } = articleData;
    
    const sql = 
      'UPDATE article SET title = ?, content = ?, region_id = ?, status = ?, coordinates_lat = ?, coordinates_lng = ?, category = ?, tags = ?, cover_image = ?, author_name = ?, culture_background = ?, opening_hours = ?, ticket_price = ?, transportation = ?, video_url = ?, culture_tips = ?, update_time = NOW() WHERE article_id = ?';
    
    await executeQuery(sql, [title, content, region_id, status, coordinates_lat, coordinates_lng, category, tags, cover_image, author_name, culture_background, opening_hours, ticket_price, transportation, video_url, culture_tips, articleId]);
    const updatedArticle = await this.getArticleById(articleId);
    
    if (authorId) {
      await this.createArticleVersion(articleId, '更新文章', authorId);
    }
    
    return updatedArticle;
  }
  
  static async createArticleVersion(articleId, changeDescription, authorId) {
    const sql = 
      'INSERT INTO article_version (article_id, author_id, change_description, create_time) VALUES (?, ?, ?, NOW())';
    await executeQuery(sql, [articleId, authorId, changeDescription]);
  }
  
  static async getArticleVersions(articleId) {
    const sql = 
      'SELECT av.*, u.username FROM article_version av LEFT JOIN user u ON av.author_id = u.user_id WHERE av.article_id = ? ORDER BY av.create_time DESC';
    return await executeQuery(sql, [articleId]);
  }

  static async deleteArticle(articleId) {
    const sql = 'DELETE FROM article WHERE article_id = ?';
    const results = await executeQuery(sql, [articleId]);
    return results.affectedRows > 0;
  }

  static async getArticlesByAuthor(authorId) {
    const sql = 'SELECT * FROM article WHERE author_id = ? ORDER BY create_time DESC';
    return await executeQuery(sql, [authorId]);
  }

  static async getArticlesByRegion(regionId) {
    const sql = 'SELECT * FROM article WHERE region_id = ? ORDER BY create_time DESC';
    return await executeQuery(sql, [regionId]);
  }

  static async getArticlesByStatus(status) {
    const sql = 'SELECT a.*, u.username as author_name FROM article a LEFT JOIN user u ON a.author_id = u.user_id WHERE a.status = ? ORDER BY a.create_time DESC';
    return await executeQuery(sql, [status]);
  }

  static async searchArticles(keyword) {
    const sql = 'SELECT a.*, u.username as author_name FROM article a LEFT JOIN user u ON a.author_id = u.user_id WHERE a.title LIKE ? OR a.content LIKE ? ORDER BY a.create_time DESC';
    const searchTerm = `%${keyword}%`;
    return await executeQuery(sql, [searchTerm, searchTerm]);
  }
  
  static async getArticles(options = {}) {
    const { 
      page = 1, 
      pageSize = 10, 
      status, 
      authorId, 
      regionId, 
      keyword, 
      sortBy = 'create_time', 
      sortOrder = 'DESC' 
    } = options;
    
    const offset = (page - 1) * pageSize;
    const conditions = [];
    const params = [];
    
    if (status) {
      conditions.push('a.status = ?');
      params.push(status);
    }
    
    if (authorId) {
      conditions.push('a.author_id = ?');
      params.push(authorId);
    }
    
    if (regionId) {
      conditions.push('a.region_id = ?');
      params.push(regionId);
    }
    
    if (keyword) {
      conditions.push('(a.title LIKE ? OR a.content LIKE ?)');
      const searchTerm = `%${keyword}%`;
      params.push(searchTerm, searchTerm);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const sql = `
      SELECT a.*, u.username as author_name, r.region_name 
      FROM article a 
      LEFT JOIN user u ON a.author_id = u.user_id 
      LEFT JOIN region r ON a.region_id = r.region_id 
      ${whereClause} 
      ORDER BY a.${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;
    
    params.push(pageSize, offset);
    const articles = await executeQuery(sql, params);
    
    const countSql = `
      SELECT COUNT(*) as total 
      FROM article a 
      ${whereClause}
    `;
    
    const countParams = params.slice(0, -2);
    const totalResult = await executeQuery(countSql, countParams);
    const total = totalResult[0].total;
    
    return {
      articles,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }
  
  static async changeArticleStatus(articleId, newStatus, authorId) {
    const sql = 'UPDATE article SET status = ?, update_time = NOW() WHERE article_id = ?';
    await executeQuery(sql, [newStatus, articleId]);
    
    await this.createArticleVersion(articleId, `状态变更为${newStatus}`, authorId);
    
    return await this.getArticleById(articleId);
  }
  
  static async getAuthorArticleStats(authorId) {
    const sql = `
      SELECT 
        status, 
        COUNT(*) as count 
      FROM article 
      WHERE author_id = ? 
      GROUP BY status
    `;
    
    const stats = await executeQuery(sql, [authorId]);
    
    const result = {};
    stats.forEach(stat => {
      result[stat.status] = stat.count;
    });
    
    return result;
  }
}

module.exports = ArticleModel;
