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
    const { title, content, author_id, region_id, status = 'published' } = articleData;
    const sql = 
      'INSERT INTO article (title, content, author_id, region_id, status, create_time, update_time) VALUES (?, ?, ?, ?, ?, NOW(), NOW())';
    
    const results = await executeQuery(sql, [title, content, author_id, region_id, status]);
    return await this.getArticleById(results.insertId);
  }

  // 更新文章
  static async updateArticle(articleId, articleData) {
    const { title, content, region_id, status } = articleData;
    const sql = 
      'UPDATE article SET title = ?, content = ?, region_id = ?, status = ?, update_time = NOW() WHERE article_id = ?';
    
    await executeQuery(sql, [title, content, region_id, status, articleId]);
    return await this.getArticleById(articleId);
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
    const sql = 'SELECT * FROM article WHERE status = ? ORDER BY create_time DESC';
    return await executeQuery(sql, [status]);
  }

  // 搜索文章
  static async searchArticles(keyword) {
    const sql = 'SELECT * FROM article WHERE title LIKE ? OR content LIKE ? ORDER BY create_time DESC';
    const searchTerm = `%${keyword}%`;
    return await executeQuery(sql, [searchTerm, searchTerm]);
  }
}

module.exports = ArticleModel;
