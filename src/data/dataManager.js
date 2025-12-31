// JSON file imports using ES modules
import apiService from '../services/apiService.js';

class DataManager {
  constructor() {
    // Initialize with empty arrays
    this.locations = [];
    this.locationsMetadata = {};
    
    // 文章数据
    this.articles = [];
    this.articlesMetadata = {};
    
    // Initialization state
    this.isInitialized = false;
  }
  
  async init() {
    try {
      // Load all data from API services
      const locationsData = await apiService.region.getAllRegions();
      const articlesData = await apiService.article.getAllArticles();
      
      // Check if data exists before mapping
      if (Array.isArray(locationsData)) {
        this.locations = locationsData.map(this.convertDbRegionToFrontend.bind(this));
      }
      
      if (Array.isArray(articlesData)) {
        this.articles = articlesData.map(this.convertDbArticleToFrontend.bind(this));
      } else if (articlesData && Array.isArray(articlesData.articles)) {
        this.articles = articlesData.articles.map(this.convertDbArticleToFrontend.bind(this));
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize data from API, using local JSON as fallback:', error);
      // Fallback to local JSON if API fails
      await this.loadLocalData();
      this.isInitialized = true;
    }
  }

  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.init();
    }
  }
  
  async loadLocalData() {
    try {
      // Load JSON files using dynamic imports
      const locationsData = (await import('./locations.json')).default;
      const articlesData = (await import('./articles.json')).default;
      const settingsData = (await import('./settings.json')).default;
      
      this.locations = locationsData.locations;
      this.locationsMetadata = locationsData.metadata;
      
      this.articles = articlesData.articles;
      this.articlesMetadata = articlesData.metadata;
      
      this.websiteSettings = settingsData.website_settings;
    } catch (error) {
      console.error('Failed to load local data:', error);
    }
  }

  // 辅助方法：将数据库格式的地域转换为前端格式
  convertDbRegionToFrontend(region) {
    if (!region) return null;
    
    // 解析经纬度
    let coordinates = { lng: 0, lat: 0 };
    if (region.location && typeof region.location === 'string') {
      const match = region.location.match(/POINT\((\d+\.?\d*) (\d+\.?\d*)\)/);
      if (match) {
        coordinates = { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
      }
    }
    
    return {
      id: region.region_id,
      name: { zh: region.region_name },
      description: { zh: region.description || '' },
      coordinates: coordinates,
      population: region.population || null,
      language: region.language || null,
      layer: 'country', // 默认值，可根据需要扩展
      type: 'country', // 默认值，可根据需要扩展
      tags: [], // 默认值，可根据需要扩展
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // 辅助方法：将前端格式的地域转换为数据库格式
  convertFrontendRegionToDb(location) {
    return {
      region_name: location.name.zh,
      parent_id: location.parent_id || null,
      location: `POINT(${location.coordinates.lng} ${location.coordinates.lat})`,
      population: location.population || null,
      language: location.language || null,
      description: location.description.zh || ''
    };
  }

  // 获取所有地点
  async getAllLocations() {
    await this.ensureInitialized();
    try {
      const regions = await apiService.region.getAllRegions();
      // 转换为前端需要的格式
      const locations = regions.map(region => this.convertDbRegionToFrontend(region));
      // 更新本地缓存
      this.locations = locations;
      this.locationsMetadata.total_locations = locations.length;
      return locations;
    } catch (error) {
      console.error('获取所有地点失败:', error);
      return this.locations;
    }
  }

  // 根据图层获取地点
  async getLocationsByLayer(layer) {
    await this.ensureInitialized();
    const locations = await this.getAllLocations();
    if (!layer || layer === 'all') {
      return locations;
    }
    return locations.filter(location => location.layer === layer);
  }

  // 根据ID获取地点
  async getLocationById(id) {
    await this.ensureInitialized();
    try {
      const region = await apiService.region.getRegionById(id);
      if (region) {
        return this.convertDbRegionToFrontend(region);
      }
      return null;
    } catch (error) {
      console.error(`获取地点 ${id} 失败:`, error);
      return this.locations.find(location => location.id === id);
    }
  }

  // 根据标签获取地点
  async getLocationsByTag(tag) {
    await this.ensureInitialized();
    const locations = await this.getAllLocations();
    return locations.filter(location => location.tags && location.tags.includes(tag));
  }

  // 根据类型获取地点
  async getLocationsByType(type) {
    await this.ensureInitialized();
    const locations = await this.getAllLocations();
    return locations.filter(location => location.type === type);
  }

  // 搜索地点
  async searchLocations(query, language = 'zh') {
    await this.ensureInitialized();
    const locations = await this.getAllLocations();
    const lowerQuery = query.toLowerCase();
    return locations.filter(location => 
      location.name[language].toLowerCase().includes(lowerQuery) ||
      location.description[language].toLowerCase().includes(lowerQuery) ||
      (location.tags && location.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }

  // 添加地点
  async addLocation(location) {
    try {
      // 转换为数据库格式
      const regionData = this.convertFrontendRegionToDb(location);
      const newRegion = await apiService.region.createRegion(regionData);
      // 转换回前端格式
      const newLocation = this.convertDbRegionToFrontend(newRegion);
      // 更新本地缓存
      this.locations.push(newLocation);
      this.locationsMetadata.total_locations = this.locations.length;
      this.locationsMetadata.last_updated = new Date().toISOString();
      return newLocation;
    } catch (error) {
      console.error('添加地点失败:', error);
      // 降级到本地处理
      const newLocation = {
        ...location,
        id: `loc_${(this.locations.length + 1).toString().padStart(3, '0')}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.locations.push(newLocation);
      this.locationsMetadata.total_locations = this.locations.length;
      this.locationsMetadata.last_updated = new Date().toISOString();
      return newLocation;
    }
  }

  // 更新地点
  async updateLocation(id, updates) {
    try {
      // 获取当前地点
      const currentLocation = await this.getLocationById(id);
      if (!currentLocation) return null;
      
      // 合并更新
      const updatedLocation = {
        ...currentLocation,
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // 转换为数据库格式
      const regionData = this.convertFrontendRegionToDb(updatedLocation);
      const updatedRegion = await apiService.region.updateRegion(id, regionData);
      
      // 转换回前端格式
      const finalLocation = this.convertDbRegionToFrontend(updatedRegion);
      
      // 更新本地缓存
      const index = this.locations.findIndex(location => location.id === id);
      if (index !== -1) {
        this.locations[index] = finalLocation;
      }
      this.locationsMetadata.last_updated = new Date().toISOString();
      
      return finalLocation;
    } catch (error) {
      console.error(`更新地点 ${id} 失败:`, error);
      // 降级到本地处理
      const index = this.locations.findIndex(location => location.id === id);
      if (index === -1) return null;
      
      this.locations[index] = {
        ...this.locations[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      this.locationsMetadata.last_updated = new Date().toISOString();
      return this.locations[index];
    }
  }

  // 删除地点
  async deleteLocation(id) {
    try {
      const success = await apiService.region.deleteRegion(id);
      if (success) {
        // 更新本地缓存
        const index = this.locations.findIndex(location => location.id === id);
        if (index !== -1) {
          this.locations.splice(index, 1);
        }
        this.locationsMetadata.total_locations = this.locations.length;
        this.locationsMetadata.last_updated = new Date().toISOString();
      }
      return success;
    } catch (error) {
      console.error(`删除地点 ${id} 失败:`, error);
      // 降级到本地处理
      const index = this.locations.findIndex(location => location.id === id);
      if (index === -1) return false;
      
      this.locations.splice(index, 1);
      this.locationsMetadata.total_locations = this.locations.length;
      this.locationsMetadata.last_updated = new Date().toISOString();
      return true;
    }
  }

  // 获取元数据
  getMetadata() {
    return this.locationsMetadata;
  }

  // 获取所有图层类型
  async getLayers() {
    const locations = await this.getAllLocations();
    const layers = [...new Set(locations.map(location => location.layer))];
    return layers.sort();
  }

  // 获取所有地点类型
  async getTypes() {
    const locations = await this.getAllLocations();
    const types = [...new Set(locations.map(location => location.type))];
    return types.sort();
  }



  // 辅助方法：将数据库格式的文章转换为前端格式
  convertDbArticleToFrontend(article) {
    if (!article) return null;
    
    return {
      id: article.article_id,
      title: article.title,
      content: article.content,
      author_id: article.author_id,
      region_id: article.region_id,
      status: article.status,
      created_at: article.create_time || new Date().toISOString(),
      updated_at: article.update_time || new Date().toISOString(),
      coordinates_lat: article.coordinates_lat,
      coordinates_lng: article.coordinates_lng,
      category: article.category || 'culture',
      tags: article.tags,
      cover_image: article.cover_image,
      author_name: article.author_name,
      views: article.views,
      culture_background: article.culture_background,
      opening_hours: article.opening_hours,
      ticket_price: article.ticket_price,
      transportation: article.transportation,
      video_url: article.video_url,
      culture_tips: article.culture_tips
    };
  }

  // 辅助方法：将前端格式的文章转换为数据库格式
  convertFrontendArticleToDb(article) {
    return {
      title: article.title,
      content: article.content,
      region_id: article.region_id || null,
      author_id: article.author_id,
      status: article.status || 'draft',
      coordinates_lat: article.coordinates_lat || null,
      coordinates_lng: article.coordinates_lng || null,
      category: article.category || 'culture',
      tags: article.tags || null,
      cover_image: article.cover_image || null
    };
  }



  // 文章管理相关方法
  async getAllArticles() {
    try {
      const result = await apiService.article.getAllArticles();
      const articles = result.articles || result;
      const formattedArticles = articles.map(article => this.convertDbArticleToFrontend(article));
      this.articles = formattedArticles;
      this.articlesMetadata.total_articles = formattedArticles.length;
      this.articlesMetadata.last_updated = new Date().toISOString();
      return formattedArticles;
    } catch (error) {
      console.error('获取所有文章失败:', error);
      return this.articles;
    }
  }

  async getArticleById(id) {
    try {
      const article = await apiService.article.getArticleById(id);
      if (article) {
        return this.convertDbArticleToFrontend(article);
      }
      return null;
    } catch (error) {
      console.error(`获取文章 ${id} 失败:`, error);
      return this.articles.find(article => article.id === id);
    }
  }

  async searchArticles(query, language = 'zh') {
    const articles = await this.getAllArticles();
    const lowerQuery = query.toLowerCase();
    return articles.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery)
    );
  }

  async addArticle(article) {
    try {
      // 转换为数据库格式
      const articleData = this.convertFrontendArticleToDb(article);
      const newArticle = await apiService.article.createArticle(articleData);
      // 转换回前端格式
      const formattedArticle = this.convertDbArticleToFrontend(newArticle);
      // 更新本地缓存
      this.articles.push(formattedArticle);
      this.articlesMetadata.total_articles = this.articles.length;
      this.articlesMetadata.last_updated = new Date().toISOString();
      return formattedArticle;
    } catch (error) {
      console.error('添加文章失败:', error);
      // 降级到本地处理
      const newArticle = {
        ...article,
        id: `article_${(this.articles.length + 1).toString().padStart(4, '0')}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'draft'
      };
      this.articles.push(newArticle);
      this.articlesMetadata.total_articles = this.articles.length;
      this.articlesMetadata.last_updated = new Date().toISOString();
      return newArticle;
    }
  }

  async updateArticle(id, updates) {
    try {
      // 获取当前文章
      const currentArticle = await this.getArticleById(id);
      if (!currentArticle) return null;
      
      // 合并更新
      const updatedArticle = {
        ...currentArticle,
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // 转换为数据库格式
      const articleData = this.convertFrontendArticleToDb(updatedArticle);
      const updatedDbArticle = await apiService.article.updateArticle(id, articleData);
      
      // 转换回前端格式
      const finalArticle = this.convertDbArticleToFrontend(updatedDbArticle);
      
      // 更新本地缓存
      const index = this.articles.findIndex(article => article.id === id);
      if (index !== -1) {
        this.articles[index] = finalArticle;
      }
      this.articlesMetadata.last_updated = new Date().toISOString();
      
      return finalArticle;
    } catch (error) {
      console.error(`更新文章 ${id} 失败:`, error);
      // 降级到本地处理
      const index = this.articles.findIndex(article => article.id === id);
      if (index === -1) return null;
      
      this.articles[index] = {
        ...this.articles[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      this.articlesMetadata.last_updated = new Date().toISOString();
      return this.articles[index];
    }
  }

  async deleteArticle(id) {
    try {
      const success = await apiService.article.deleteArticle(id);
      if (success) {
        // 更新本地缓存
        const index = this.articles.findIndex(article => article.id === id);
        if (index !== -1) {
          this.articles.splice(index, 1);
        }
        this.articlesMetadata.total_articles = this.articles.length;
        this.articlesMetadata.last_updated = new Date().toISOString();
      }
      return success;
    } catch (error) {
      console.error(`删除文章 ${id} 失败:`, error);
      // 降级到本地处理
      const index = this.articles.findIndex(article => article.id === id);
      if (index === -1) return false;
      
      this.articles.splice(index, 1);
      this.articlesMetadata.total_articles = this.articles.length;
      this.articlesMetadata.last_updated = new Date().toISOString();
      return true;
    }
  }
}


// 导出单例实例
const dataManager = new DataManager();
export default dataManager;
