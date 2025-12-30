// 地域模型
const { executeQuery } = require('../services/dbConnection.js');

class RegionModel {
  // 获取所有地域
  static async getAllRegions() {
    const sql = 'SELECT * FROM region';
    return await executeQuery(sql);
  }

  // 根据ID获取地域
  static async getRegionById(regionId) {
    const sql = 'SELECT * FROM region WHERE region_id = ?';
    const results = await executeQuery(sql, [regionId]);
    return results[0] || null;
  }

  // 创建地域
  static async createRegion(regionData) {
    const { region_name, parent_id, location, population, language, description } = regionData;
    const sql = 
      'INSERT INTO region (region_name, parent_id, location, population, language, description) VALUES (?, ?, POINT(?, ?), ?, ?, ?)';
    
    // 解析location为经纬度
    const lng = location.coordinates.lng;
    const lat = location.coordinates.lat;
    
    const results = await executeQuery(sql, [region_name, parent_id || 0, lng, lat, population, language, description]);
    return await this.getRegionById(results.insertId);
  }

  // 更新地域
  static async updateRegion(regionId, regionData) {
    const { region_name, parent_id, location, population, language, description } = regionData;
    let sql = 'UPDATE region SET region_name = ?, parent_id = ?, population = ?, language = ?, description = ?';
    const params = [region_name, parent_id || 0, population, language, description];
    
    // 如果提供了location，则更新经纬度
    if (location) {
      const lng = location.coordinates.lng;
      const lat = location.coordinates.lat;
      sql += ', location = POINT(?, ?)';
      params.push(lng, lat);
    }
    
    sql += ' WHERE region_id = ?';
    params.push(regionId);
    
    await executeQuery(sql, params);
    return await this.getRegionById(regionId);
  }

  // 删除地域
  static async deleteRegion(regionId) {
    const sql = 'DELETE FROM region WHERE region_id = ?';
    const results = await executeQuery(sql, [regionId]);
    return results.affectedRows > 0;
  }

  // 获取子地域
  static async getChildRegions(parentId) {
    const sql = 'SELECT * FROM region WHERE parent_id = ?';
    return await executeQuery(sql, [parentId]);
  }

  // 根据经纬度范围查询地域
  static async getRegionsByCoordinates(bounds) {
    const { minLng, minLat, maxLng, maxLat } = bounds;
    const sql = 
      'SELECT * FROM region WHERE MBRContains(ST_GeomFromText(?), location)';
    const polygon = `POLYGON((${minLng} ${minLat}, ${maxLng} ${minLat}, ${maxLng} ${maxLat}, ${minLng} ${maxLat}, ${minLng} ${minLat}))`;
    return await executeQuery(sql, [polygon]);
  }
}

module.exports = RegionModel;