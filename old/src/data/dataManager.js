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
    
    // 媒体数据
    this.media = [];
    this.mediaFolders = [];
    this.mediaMetadata = {};
    
    // 分类与标签
    this.categories = [];
    this.categoriesMetadata = {};
    this.tags = [];
    this.tagsMetadata = {};
    
    // 用户与权限
    this.users = [];
    this.roles = [];
    this.permissions = [];
    this.rolePermissions = [];
    this.usersMetadata = {};
    
    // 用户贡献数据
    this.userContributions = [];
    this.userContributionsMetadata = { total_contributions: 0, last_updated: new Date().toISOString() };
    
    // 系统设置
    this.websiteSettings = {};
    this.emailSettings = {};
    this.seoSettings = {};
    this.securitySettings = {};
    this.operationLogs = [];
    this.errorLogs = [];
    this.settingsMetadata = {};
    
    // Initialize data from API
    this.init();
  }
  
  async init() {
    try {
      // Load all data from API services
      const locationsData = await apiService.getAllRegions();
      const articlesData = await apiService.getAllTopics();
      const mediaData = await apiService.getAllMedia();
      const categoriesData = await apiService.getAllCategories();
      const tagsData = await apiService.getAllTags();
      const usersData = await apiService.getAllUsers();
      const rolesData = await apiService.getAllRoles();
      
      // Map API data to internal structure
      this.locations = locationsData.map(this.convertDbRegionToFrontend.bind(this));
      this.articles = articlesData.map(this.convertDbTopicToFrontend.bind(this));
      this.media = mediaData;
      this.categories = categoriesData;
      this.tags = tagsData;
      this.users = usersData;
      this.roles = rolesData;
      
      console.log('Data initialized successfully from API');
    } catch (error) {
      console.error('Failed to initialize data from API, using local JSON as fallback:', error);
      // Fallback to local JSON if API fails
      await this.loadLocalData();
    }
  }
  
  async loadLocalData() {
    try {
      // Load JSON files using dynamic imports
      const locationsData = (await import('./locations.json')).default;
      const articlesData = (await import('./articles.json')).default;
      const mediaData = (await import('./media.json')).default;
      const categoriesData = (await import('./categories.json')).default;
      const tagsData = (await import('./tags.json')).default;
      const usersData = (await import('./users.json')).default;
      const settingsData = (await import('./settings.json')).default;
      
      this.locations = locationsData.locations;
      this.locationsMetadata = locationsData.metadata;
      
      this.articles = articlesData.articles;
      this.articlesMetadata = articlesData.metadata;
      
      this.media = mediaData.media;
      this.mediaFolders = mediaData.folders;
      this.mediaMetadata = mediaData.metadata;
      
      this.categories = categoriesData.categories;
      this.categoriesMetadata = categoriesData.metadata;
      this.tags = tagsData.tags;
      this.tagsMetadata = tagsData.metadata;
      
      this.users = usersData.users;
      this.roles = usersData.roles;
      this.permissions = usersData.permissions;
      this.rolePermissions = usersData.role_permissions;
      this.usersMetadata = usersData.metadata;
      
      this.websiteSettings = settingsData.website_settings;
      this.emailSettings = settingsData.email_settings;
      this.seoSettings = settingsData.seo_settings;
      this.securitySettings = settingsData.security_settings;
      this.operationLogs = settingsData.logs.operation_logs;
      this.errorLogs = settingsData.logs.error_logs;
      this.settingsMetadata = settingsData.metadata;
      
      console.log('Local data loaded successfully as fallback');
    } catch (error) {
      console.error('Failed to load local data:', error);
    }
  }

  // 辅助方法：将数据库格式的地域转换为前端格式
  convertDbRegionToFrontend(region) {
    if (!region) return null;
    
    // 解析经纬度
    let coordinates = { lng: 0, lat: 0 };
    if (region.location) {
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
    const locations = await this.getAllLocations();
    if (!layer || layer === 'all') {
      return locations;
    }
    return locations.filter(location => location.layer === layer);
  }

  // 根据ID获取地点
  async getLocationById(id) {
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
    const locations = await this.getAllLocations();
    return locations.filter(location => location.tags && location.tags.includes(tag));
  }

  // 根据类型获取地点
  async getLocationsByType(type) {
    const locations = await this.getAllLocations();
    return locations.filter(location => location.type === type);
  }

  // 搜索地点
  async searchLocations(query, language = 'zh') {
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



  // 辅助方法：将数据库格式的专题转换为前端格式
  convertDbTopicToFrontend(topic) {
    if (!topic) return null;
    
    return {
      id: topic.topic_id,
      title: { zh: topic.title },
      cover_image: topic.cover_url || '',
      content: { zh: topic.content },
      location_id: topic.region_id,
      author_id: topic.author_id,
      status: topic.status || '草稿',
      created_at: topic.create_time || new Date().toISOString(),
      updated_at: topic.update_time || new Date().toISOString(),
      tags: [], // 默认值，可根据需要扩展
      category_id: null // 默认值，可根据需要扩展
    };
  }

  // 辅助方法：将前端格式的文章转换为数据库格式
  convertFrontendArticleToDb(article) {
    return {
      title: article.title.zh,
      cover_url: article.cover_image || '',
      content: article.content.zh || '',
      region_id: article.location_id || null,
      author_id: article.author_id,
      status: article.status || 'draft'
    };
  }

  // 辅助方法：将数据库格式的用户贡献转换为前端格式
  convertDbContributionToFrontend(contribution) {
    if (!contribution) return null;
    
    return {
      id: contribution.contribution_id,
      user_id: contribution.user_id,
      location_id: contribution.region_id,
      content_type: contribution.content_type,
      content: contribution.content || '',
      media_url: contribution.media_url || '',
      status: contribution.status || '待审核',
      created_at: contribution.create_time || new Date().toISOString(),
      audit_time: contribution.audit_time || null,
      auditor_id: contribution.auditor_id || null
    };
  }

  // 辅助方法：将前端格式的用户贡献转换为数据库格式
  convertFrontendContributionToDb(contribution) {
    return {
      user_id: contribution.user_id,
      region_id: contribution.location_id || null,
      content_type: contribution.content_type,
      content: contribution.content || '',
      media_url: contribution.media_url || ''
    };
  }

  // 文章管理相关方法
  async getAllArticles() {
    try {
      const topics = await apiService.topic.getAllTopics();
      // 转换为前端需要的格式
      const articles = topics.map(topic => this.convertDbTopicToFrontend(topic));
      // 更新本地缓存
      this.articles = articles;
      this.articlesMetadata.total_articles = articles.length;
      this.articlesMetadata.last_updated = new Date().toISOString();
      return articles;
    } catch (error) {
      console.error('获取所有文章失败:', error);
      return this.articles;
    }
  }

  async getArticleById(id) {
    try {
      const topic = await apiService.topic.getTopicById(id);
      if (topic) {
        return this.convertDbTopicToFrontend(topic);
      }
      return null;
    } catch (error) {
      console.error(`获取文章 ${id} 失败:`, error);
      return this.articles.find(article => article.id === id);
    }
  }

  async getArticlesByStatus(status) {
    const articles = await this.getAllArticles();
    if (!status) return articles;
    return articles.filter(article => article.status === status);
  }

  async getArticlesByAuthor(authorId) {
    const articles = await this.getAllArticles();
    return articles.filter(article => article.author_id === authorId);
  }

  async getArticlesByCategory(categoryId) {
    const articles = await this.getAllArticles();
    return articles.filter(article => article.category_id === categoryId);
  }

  async getArticlesByTag(tagId) {
    const articles = await this.getAllArticles();
    return articles.filter(article => article.tags && article.tags.includes(tagId));
  }

  async searchArticles(query, language = 'zh') {
    const articles = await this.getAllArticles();
    const lowerQuery = query.toLowerCase();
    return articles.filter(article => 
      article.title[language].toLowerCase().includes(lowerQuery) ||
      article.content[language].toLowerCase().includes(lowerQuery)
    );
  }

  async addArticle(article) {
    try {
      // 转换为数据库格式
      const topicData = this.convertFrontendArticleToDb(article);
      const newTopic = await apiService.topic.createTopic(topicData);
      // 转换回前端格式
      const newArticle = this.convertDbTopicToFrontend(newTopic);
      // 更新本地缓存
      this.articles.push(newArticle);
      this.articlesMetadata.total_articles = this.articles.length;
      this.articlesMetadata.last_updated = new Date().toISOString();
      return newArticle;
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
      const topicData = this.convertFrontendArticleToDb(updatedArticle);
      const updatedTopic = await apiService.topic.updateTopic(id, topicData);
      
      // 转换回前端格式
      const finalArticle = this.convertDbTopicToFrontend(updatedTopic);
      
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
      const success = await apiService.topic.deleteTopic(id);
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

  // 用户贡献管理相关方法
  async getAllUserContributions() {
    try {
      const contributions = await apiService.userContribution.getAllContributions();
      // 转换为前端格式
      const frontendContributions = contributions.map(contribution => this.convertDbContributionToFrontend(contribution));
      // 更新本地缓存
      this.userContributions = frontendContributions;
      this.userContributionsMetadata.total_contributions = frontendContributions.length;
      this.userContributionsMetadata.last_updated = new Date().toISOString();
      return frontendContributions;
    } catch (error) {
      console.error('获取用户贡献列表失败:', error);
      return this.userContributions;
    }
  }

  async addUserContribution(contribution) {
    try {
      // 转换为数据库格式
      const contributionData = this.convertFrontendContributionToDb(contribution);
      const newContribution = await apiService.userContribution.createContribution(contributionData);
      // 转换回前端格式
      const frontendContribution = this.convertDbContributionToFrontend(newContribution);
      // 更新本地缓存
      this.userContributions.push(frontendContribution);
      this.userContributionsMetadata.total_contributions = this.userContributions.length;
      this.userContributionsMetadata.last_updated = new Date().toISOString();
      return frontendContribution;
    } catch (error) {
      console.error('创建用户贡献失败:', error);
      // 降级到本地处理
      const newContribution = {
        ...contribution,
        id: `contrib_${(this.userContributions.length + 1).toString().padStart(5, '0')}`,
        created_at: new Date().toISOString(),
        status: '待审核',
        audit_time: null,
        auditor_id: null
      };
      this.userContributions.push(newContribution);
      this.userContributionsMetadata.total_contributions = this.userContributions.length;
      this.userContributionsMetadata.last_updated = new Date().toISOString();
      return newContribution;
    }
  }

  async updateUserContributionStatus(id, status, auditorId) {
    try {
      await apiService.userContribution.updateContributionStatus(id, status, auditorId);
      // 更新本地缓存
      const index = this.userContributions.findIndex(contribution => contribution.id === id);
      if (index !== -1) {
        this.userContributions[index] = {
          ...this.userContributions[index],
          status,
          audit_time: new Date().toISOString(),
          auditor_id: auditorId
        };
        this.userContributionsMetadata.last_updated = new Date().toISOString();
      }
      return true;
    } catch (error) {
      console.error(`更新贡献状态失败:`, error);
      // 降级到本地处理
      const index = this.userContributions.findIndex(contribution => contribution.id === id);
      if (index === -1) return false;
      
      this.userContributions[index] = {
        ...this.userContributions[index],
        status,
        audit_time: new Date().toISOString(),
        auditor_id: auditorId
      };
      this.userContributionsMetadata.last_updated = new Date().toISOString();
      return true;
    }
  }

  async getUserContributionsByStatus(status) {
    const contributions = await this.getAllUserContributions();
    if (!status) return contributions;
    return contributions.filter(contribution => contribution.status === status);
  }

  async getUserContributionsByUser(userId) {
    const contributions = await this.getAllUserContributions();
    return contributions.filter(contribution => contribution.user_id === userId);
  }

  async getUserContributionsByLocation(locationId) {
    const contributions = await this.getAllUserContributions();
    return contributions.filter(contribution => contribution.location_id === locationId);
  }

  // 媒体管理相关方法
  getAllMedia() {
    return this.media;
  }

  getMediaById(id) {
    return this.media.find(media => media.id === id);
  }

  getMediaByType(type) {
    if (!type) return this.media;
    return this.media.filter(media => media.type === type);
  }

  getMediaByFolder(folderId) {
    return this.media.filter(media => media.folder_id === folderId);
  }

  addMedia(media) {
    const newMedia = {
      ...media,
      id: `media_${(this.media.length + 1).toString().padStart(4, '0')}`,
      uploaded_at: new Date().toISOString(),
      size: media.size || 0
    };
    this.media.push(newMedia);
    this.mediaMetadata.total_files = this.media.length;
    this.mediaMetadata.last_updated = new Date().toISOString();
    return newMedia;
  }

  deleteMedia(id) {
    const index = this.media.findIndex(media => media.id === id);
    if (index === -1) return false;
    
    this.media.splice(index, 1);
    this.mediaMetadata.total_files = this.media.length;
    this.mediaMetadata.last_updated = new Date().toISOString();
    return true;
  }

  getAllMediaFolders() {
    return this.mediaFolders;
  }

  addMediaFolder(folder) {
    const newFolder = {
      ...folder,
      id: `folder_${(this.mediaFolders.length + 1).toString().padStart(3, '0')}`,
      created_at: new Date().toISOString()
    };
    this.mediaFolders.push(newFolder);
    return newFolder;
  }

  deleteMediaFolder(id) {
    // 检查文件夹是否为空
    const hasMedia = this.media.some(media => media.folder_id === id);
    if (hasMedia) return false;
    
    const index = this.mediaFolders.findIndex(folder => folder.id === id);
    if (index === -1) return false;
    
    this.mediaFolders.splice(index, 1);
    return true;
  }

  // 分类管理相关方法
  getAllCategories() {
    return this.categories;
  }

  getCategoryById(id) {
    return this.categories.find(category => category.id === id);
  }

  getCategoriesByParent(parentId) {
    return this.categories.filter(category => category.parent_id === parentId);
  }

  addCategory(category) {
    const newCategory = {
      ...category,
      id: `cat_${(this.categories.length + 1).toString().padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.categories.push(newCategory);
    this.categoriesMetadata.total_categories = this.categories.length;
    return newCategory;
  }

  updateCategory(id, updates) {
    const index = this.categories.findIndex(category => category.id === id);
    if (index === -1) return null;
    
    this.categories[index] = {
      ...this.categories[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    return this.categories[index];
  }

  deleteCategory(id) {
    // 检查是否有文章属于该分类
    const hasArticles = this.articles.some(article => article.category_id === id);
    if (hasArticles) return false;
    
    // 检查是否有子分类
    const hasChildren = this.categories.some(category => category.parent_id === id);
    if (hasChildren) return false;
    
    const index = this.categories.findIndex(category => category.id === id);
    if (index === -1) return false;
    
    this.categories.splice(index, 1);
    this.categoriesMetadata.total_categories = this.categories.length;
    return true;
  }

  // 标签管理相关方法
  getAllTags() {
    return this.tags;
  }

  getTagById(id) {
    return this.tags.find(tag => tag.id === id);
  }

  addTag(tag) {
    const newTag = {
      ...tag,
      id: `tag_${(this.tags.length + 1).toString().padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      article_count: 0
    };
    this.tags.push(newTag);
    return newTag;
  }

  updateTag(id, updates) {
    const index = this.tags.findIndex(tag => tag.id === id);
    if (index === -1) return null;
    
    this.tags[index] = {
      ...this.tags[index],
      ...updates
    };
    
    return this.tags[index];
  }

  deleteTag(id) {
    const index = this.tags.findIndex(tag => tag.id === id);
    if (index === -1) return false;
    
    // 从所有文章中移除该标签
    this.articles.forEach(article => {
      if (article.tags && article.tags.includes(id)) {
        article.tags = article.tags.filter(tagId => tagId !== id);
      }
    });
    
    this.tags.splice(index, 1);
    return true;
  }

  // 用户管理相关方法
  async getAllUsers() {
    try {
      const users = await apiService.user.getAllUsers();
      // 更新本地缓存
      this.users = users;
      this.usersMetadata.total_users = users.length;
      return users;
    } catch (error) {
      console.error('获取用户列表失败:', error);
      return this.users;
    }
  }

  async getUserById(id) {
    try {
      const user = await apiService.user.getUserById(id);
      return user;
    } catch (error) {
      console.error(`获取用户 ${id} 失败:`, error);
      return this.users.find(user => user.id === id);
    }
  }

  async getUserByUsername(username) {
    try {
      const user = await apiService.user.getUserByUsername(username);
      return user;
    } catch (error) {
      console.error(`获取用户 ${username} 失败:`, error);
      return this.users.find(user => user.username === username);
    }
  }

  async addUser(user) {
    try {
      const newUser = await apiService.user.createUser(user);
      // 更新本地缓存
      this.users.push(newUser);
      this.usersMetadata.total_users = this.users.length;
      return newUser;
    } catch (error) {
      console.error('创建用户失败:', error);
      // 降级到本地处理
      const newUser = {
        ...user,
        id: `user_${(this.users.length + 1).toString().padStart(3, '0')}`,
        created_at: new Date().toISOString(),
        status: 'active'
      };
      this.users.push(newUser);
      this.usersMetadata.total_users = this.users.length;
      return newUser;
    }
  }

  async updateUser(id, updates) {
    try {
      const updatedUser = await apiService.user.updateUser(id, updates);
      // 更新本地缓存
      const index = this.users.findIndex(user => user.id === id);
      if (index !== -1) {
        this.users[index] = updatedUser;
      }
      return updatedUser;
    } catch (error) {
      console.error(`更新用户 ${id} 失败:`, error);
      // 降级到本地处理
      const index = this.users.findIndex(user => user.id === id);
      if (index === -1) return null;
      
      this.users[index] = {
        ...this.users[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return this.users[index];
    }
  }

  async deleteUser(id) {
    try {
      const success = await apiService.user.deleteUser(id);
      // 更新本地缓存
      if (success) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
          this.users.splice(index, 1);
          this.usersMetadata.total_users = this.users.length;
        }
      }
      return success;
    } catch (error) {
      console.error(`删除用户 ${id} 失败:`, error);
      // 降级到本地处理
      const index = this.users.findIndex(user => user.id === id);
      if (index === -1) return false;
      
      this.users.splice(index, 1);
      this.usersMetadata.total_users = this.users.length;
      return true;
    }
  }

  // 权限管理相关方法
  async getAllRoles() {
    try {
      const roles = await apiService.rolePermission.getAllRoles();
      // 更新本地缓存
      this.roles = roles;
      return roles;
    } catch (error) {
      console.error('获取角色列表失败:', error);
      return this.roles;
    }
  }

  async getRoleById(id) {
    try {
      // 先从本地缓存查找
      const role = this.roles.find(role => role.id === id);
      if (role) return role;
      
      // 如果本地没有，从API获取
      return await apiService.rolePermission.getRoleById(id);
    } catch (error) {
      console.error(`获取角色 ${id} 失败:`, error);
      return this.roles.find(role => role.id === id);
    }
  }

  async addRole(role) {
    try {
      const newRole = await apiService.rolePermission.createRole(role);
      // 更新本地缓存
      this.roles.push(newRole);
      return newRole;
    } catch (error) {
      console.error('创建角色失败:', error);
      // 降级到本地处理
      const newRole = {
        ...role,
        id: `role_${(this.roles.length + 1).toString().padStart(3, '0')}`,
        created_at: new Date().toISOString()
      };
      this.roles.push(newRole);
      return newRole;
    }
  }

  async deleteRole(id) {
    try {
      // 检查是否为超级管理员角色
      if (id === 'role_001') return false;
      
      // 检查是否有用户关联到该角色
      const users = await this.getAllUsers();
      const hasUsers = users.some(user => user.role_id === id);
      if (hasUsers) return false;
      
      const success = await apiService.rolePermission.deleteRole(id);
      // 更新本地缓存
      if (success) {
        const index = this.roles.findIndex(role => role.id === id);
        if (index !== -1) {
          this.roles.splice(index, 1);
        }
        // 删除相关的权限关联
        this.rolePermissions = this.rolePermissions.filter(rp => rp.role_id !== id);
      }
      return success;
    } catch (error) {
      console.error(`删除角色 ${id} 失败:`, error);
      // 降级到本地处理
      // 检查是否为超级管理员角色
      if (id === 'role_001') return false;
      
      // 检查是否有用户关联到该角色
      const hasUsers = this.users.some(user => user.role_id === id);
      if (hasUsers) return false;
      
      const index = this.roles.findIndex(role => role.id === id);
      if (index === -1) return false;
      
      // 删除相关的权限关联
      this.rolePermissions = this.rolePermissions.filter(rp => rp.role_id !== id);
      
      this.roles.splice(index, 1);
      return true;
    }
  }

  async updateRole(id, updates) {
    try {
      const updatedRole = await apiService.rolePermission.updateRole(id, updates);
      // 更新本地缓存
      const index = this.roles.findIndex(role => role.id === id);
      if (index !== -1) {
        this.roles[index] = updatedRole;
      }
      return updatedRole;
    } catch (error) {
      console.error(`更新角色 ${id} 失败:`, error);
      // 降级到本地处理
      const index = this.roles.findIndex(role => role.id === id);
      if (index === -1) return null;
      
      this.roles[index] = {
        ...this.roles[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return this.roles[index];
    }
  }

  async getAllRolePermissions() {
    return this.rolePermissions;
  }

  async updateRolePermissions(roleId, permissionIds) {
    try {
      const success = await apiService.rolePermission.updateRolePermissions(roleId, permissionIds);
      // 更新本地缓存
      if (success) {
        // 删除该角色的所有现有权限
        this.rolePermissions = this.rolePermissions.filter(rp => rp.role_id !== roleId);
        
        // 添加新的权限关联
        permissionIds.forEach(permissionId => {
          this.rolePermissions.push({ role_id: roleId, permission_id: permissionId });
        });
      }
      return success;
    } catch (error) {
      console.error(`更新角色 ${roleId} 权限失败:`, error);
      // 降级到本地处理
      // 删除该角色的所有现有权限
      this.rolePermissions = this.rolePermissions.filter(rp => rp.role_id !== roleId);
      
      // 添加新的权限关联
      permissionIds.forEach(permissionId => {
        this.rolePermissions.push({ role_id: roleId, permission_id: permissionId });
      });
      
      return true;
    }
  }

  async getAllPermissions() {
    try {
      const permissions = await apiService.rolePermission.getAllPermissions();
      // 更新本地缓存
      this.permissions = permissions;
      return permissions;
    } catch (error) {
      console.error('获取权限列表失败:', error);
      return this.permissions;
    }
  }

  async getPermissionsByRole(roleId) {
    try {
      const permissionIds = await apiService.rolePermission.getRolePermissions(roleId);
      const allPermissions = await this.getAllPermissions();
      return allPermissions.filter(permission => permissionIds.includes(permission.id));
    } catch (error) {
      console.error(`获取角色 ${roleId} 权限失败:`, error);
      // 降级到本地处理
      const rolePermissionIds = this.rolePermissions.filter(rp => rp.role_id === roleId).map(rp => rp.permission_id);
      return this.permissions.filter(permission => rolePermissionIds.includes(permission.id));
    }
  }

  async assignPermission(roleId, permissionId) {
    try {
      // 检查是否已存在该关联
      const existingPermissions = await this.getPermissionsByRole(roleId);
      const exists = existingPermissions.some(permission => permission.id === permissionId);
      if (exists) return false;
      
      // 更新权限列表
      const newPermissions = [...existingPermissions.map(p => p.id), permissionId];
      return await this.updateRolePermissions(roleId, newPermissions);
    } catch (error) {
      console.error(`分配权限失败:`, error);
      // 降级到本地处理
      // 检查是否已存在该关联
      const exists = this.rolePermissions.some(rp => rp.role_id === roleId && rp.permission_id === permissionId);
      if (exists) return false;
      
      this.rolePermissions.push({ role_id: roleId, permission_id: permissionId });
      return true;
    }
  }

  async removePermission(roleId, permissionId) {
    try {
      // 获取当前权限列表
      const existingPermissions = await this.getPermissionsByRole(roleId);
      // 过滤掉要移除的权限
      const newPermissions = existingPermissions.map(p => p.id).filter(id => id !== permissionId);
      // 更新权限列表
      return await this.updateRolePermissions(roleId, newPermissions);
    } catch (error) {
      console.error(`移除权限失败:`, error);
      // 降级到本地处理
      const index = this.rolePermissions.findIndex(rp => rp.role_id === roleId && rp.permission_id === permissionId);
      if (index === -1) return false;
      
      this.rolePermissions.splice(index, 1);
      return true;
    }
  }

  // 系统设置相关方法
  getWebsiteSettings() {
    return this.websiteSettings;
  }

  updateWebsiteSettings(updates) {
    this.websiteSettings = {
      ...this.websiteSettings,
      ...updates
    };
    return this.websiteSettings;
  }

  getEmailSettings() {
    return this.emailSettings;
  }

  updateEmailSettings(updates) {
    this.emailSettings = {
      ...this.emailSettings,
      ...updates
    };
    return this.emailSettings;
  }

  getSEOSettings() {
    return this.seoSettings;
  }

  updateSEOSettings(updates) {
    this.seoSettings = {
      ...this.seoSettings,
      ...updates
    };
    return this.seoSettings;
  }

  getSecuritySettings() {
    return this.securitySettings;
  }

  updateSecuritySettings(updates) {
    this.securitySettings = {
      ...this.securitySettings,
      ...updates
    };
    return this.securitySettings;
  }

  // 日志管理相关方法
  getAllOperationLogs() {
    return this.operationLogs;
  }

  addOperationLog(log) {
    const newLog = {
      ...log,
      id: `log_${(this.operationLogs.length + 1).toString().padStart(5, '0')}`,
      timestamp: new Date().toISOString()
    };
    this.operationLogs.push(newLog);
    return newLog;
  }

  getAllErrorLogs() {
    return this.errorLogs;
  }

  addErrorLog(log) {
    const newLog = {
      ...log,
      id: `error_${(this.errorLogs.length + 1).toString().padStart(5, '0')}`,
      timestamp: new Date().toISOString()
    };
    this.errorLogs.push(newLog);
    return newLog;
  }

  // 更新日志（清空日志）
  clearOperationLogs() {
    this.operationLogs = [];
    return true;
  }

  clearErrorLogs() {
    this.errorLogs = [];
    return true;
  }
}


// 导出单例实例
const dataManager = new DataManager();
export default dataManager;
