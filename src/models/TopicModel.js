// 专题模型
import { executeQuery } from '../services/dbConnection.js';

class TopicModel {
  // 获取所有专题
  static async getAllTopics() {
    const sql = 'SELECT * FROM topic ORDER BY create_time DESC';
    return await executeQuery(sql);
  }

  // 根据ID获取专题
  static async getTopicById(topicId) {
    const sql = 'SELECT * FROM topic WHERE topic_id = ?';
    const results = await executeQuery(sql, [topicId]);
    return results[0] || null;
  }

  // 创建专题
  static async createTopic(topicData) {
    const { title, cover_url, content, region_id, author_id, status } = topicData;
    const sql = 
      'INSERT INTO topic (title, cover_url, content, region_id, author_id, status, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())';
    
    const results = await executeQuery(sql, [title, cover_url, content, region_id, author_id, status]);
    return await this.getTopicById(results.insertId);
  }

  // 更新专题
  static async updateTopic(topicId, topicData) {
    const { title, cover_url, content, region_id, status } = topicData;
    const sql = 
      'UPDATE topic SET title = ?, cover_url = ?, content = ?, region_id = ?, status = ?, update_time = NOW() WHERE topic_id = ?';
    
    await executeQuery(sql, [title, cover_url, content, region_id, status, topicId]);
    return await this.getTopicById(topicId);
  }

  // 删除专题
  static async deleteTopic(topicId) {
    const sql = 'DELETE FROM topic WHERE topic_id = ?';
    const results = await executeQuery(sql, [topicId]);
    return results.affectedRows > 0;
  }

  // 根据作者ID获取专题
  static async getTopicsByAuthor(authorId) {
    const sql = 'SELECT * FROM topic WHERE author_id = ? ORDER BY create_time DESC';
    return await executeQuery(sql, [authorId]);
  }

  // 根据地域ID获取专题
  static async getTopicsByRegion(regionId) {
    const sql = 'SELECT * FROM topic WHERE region_id = ? ORDER BY create_time DESC';
    return await executeQuery(sql, [regionId]);
  }

  // 根据状态获取专题
  static async getTopicsByStatus(status) {
    const sql = 'SELECT * FROM topic WHERE status = ? ORDER BY create_time DESC';
    return await executeQuery(sql, [status]);
  }

  // 搜索专题
  static async searchTopics(keyword) {
    const sql = 'SELECT * FROM topic WHERE title LIKE ? OR content LIKE ? ORDER BY create_time DESC';
    const searchTerm = `%${keyword}%`;
    return await executeQuery(sql, [searchTerm, searchTerm]);
  }
}

export default TopicModel;