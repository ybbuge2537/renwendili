// 文章模型
const { executeQuery } = require('../services/dbConnection.js');

class ArticleModel {
  // 获取所有文章
  static async getAllArticles() {
    const sql = 'SELECT * FROM article ORDER BY create_time DESC';
    return await executeQuery(sql);
  }

  // 根据ID获取文章
  static async getArticleById(articleId) {
    const sql = 'SELECT * FROM article WHERE article_id = ?';
    const results = await executeQuery(sql, [articleId]);
    return results[0] || null;
  }

  // 创建文章
  static async createArticle(articleData) {
    const { title, content, author_id, region_id, status = 'draft' } = articleData;
    const sql = 
      'INSERT INTO article (title, content, author_id, region_id, status, create_time, update_time) VALUES (?, ?, ?, ?, ?, NOW(), NOW())';
    
    const results = await executeQuery(sql, [title, content, author_id, region_id, status]);
    const newArticle = await this.getArticleById(results.insertId);
    
    // 创建初始版本
    await this.createArticleVersion(newArticle.article_id, '初始创建', author_id);
    
    return newArticle;
  }

  // 更新文章
  static async updateArticle(articleId, articleData, authorId) {
    const { title, content, region_id, status } = articleData;
    const sql = 
      'UPDATE article SET title = ?, content = ?, region_id = ?, status = ?, update_time = NOW() WHERE article_id = ?';
    
    await executeQuery(sql, [title, content, region_id, status, articleId]);
    const updatedArticle = await this.getArticleById(articleId);
    
    // 创建新版本
    if (authorId) {
      await this.createArticleVersion(articleId, '更新文章', authorId);
    }
    
    return updatedArticle;
  }
  
  // 创建文章版本
  static async createArticleVersion(articleId, changeDescription, authorId) {
    const sql = 
      'INSERT INTO article_version (article_id, author_id, change_description, create_time) VALUES (?, ?, ?, NOW())';
    await executeQuery(sql, [articleId, authorId, changeDescription]);
  }
  
  // 获取文章版本历史
  static async getArticleVersions(articleId) {
    const sql = 
      'SELECT av.*, u.username FROM article_version av LEFT JOIN user u ON av.author_id = u.user_id WHERE av.article_id = ? ORDER BY av.create_time DESC';
    return await executeQuery(sql, [articleId]);
  }

  // 删除文章
  static async deleteArticle(articleId) {
    const sql = 'DELETE FROM article WHERE article_id = ?';
    const results = await executeQuery(sql, [articleId]);
    return results.affectedRows > 0;
  }

  // 根据作者ID获取文章
  static async getArticlesByAuthor(authorId) {
    const sql = 'SELECT * FROM article WHERE author_id = ? ORDER BY create_time DESC';
    return await executeQuery(sql, [authorId]);
  }

  // 根据地域ID获取文章
  static async getArticlesByRegion(regionId) {
    const sql = 'SELECT * FROM article WHERE region_id = ? ORDER BY create_time DESC';
    return await executeQuery(sql, [regionId]);
  }

  // 根据状态获取文章
  static async getArticlesByStatus(status) {
    const sql = 'SELECT a.*, u.username as author_name FROM article a LEFT JOIN user u ON a.author_id = u.user_id WHERE a.status = ? ORDER BY a.create_time DESC';
    return await executeQuery(sql, [status]);
  }

  // 搜索文章
  static async searchArticles(keyword) {
    const sql = 'SELECT a.*, u.username as author_name FROM article a LEFT JOIN user u ON a.author_id = u.user_id WHERE a.title LIKE ? OR a.content LIKE ? ORDER BY a.create_time DESC';
    const searchTerm = `%${keyword}%`;
    return await executeQuery(sql, [searchTerm, searchTerm]);
  }
  
  // 批量获取文章（支持分页、筛选、排序）
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
    
    // 获取文章列表
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
    
    // 获取总记录数
    const countSql = `
      SELECT COUNT(*) as total 
      FROM article a 
      ${whereClause}
    `;
    
    const countParams = params.slice(0, -2); // 移除pageSize和offset
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
  
  // 变更文章状态
  static async changeArticleStatus(articleId, newStatus, authorId) {
    const sql = 'UPDATE article SET status = ?, update_time = NOW() WHERE article_id = ?';
    await executeQuery(sql, [newStatus, articleId]);
    
    // 创建版本记录
    await this.createArticleVersion(articleId, `状态变更为${newStatus}`, authorId);
    
    return await this.getArticleById(articleId);
  }
  
  // 获取作者的文章统计
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
    
    // 转换为对象格式
    const result = {};
    stats.forEach(stat => {
      result[stat.status] = stat.count;
    });
    
    return result;
  }
}

module.exports = ArticleModel;
