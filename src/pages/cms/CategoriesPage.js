import React, { useState, useEffect } from 'react';
import CMSLayout from '../../components/cms/CMSLayout.js';
import { checkActionPermission } from '../../services/permission.js';
import './CategoriesPage.css';

function CategoriesPage() {
  // 获取当前登录用户
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  
  // 分类管理
  const [categories, setCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  // 标签管理
  const [tags, setTags] = useState([]);
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [showEditTagModal, setShowEditTagModal] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [newTag, setNewTag] = useState({
    name: ''
  });

  // 模拟从API获取分类和标签数据
  useEffect(() => {
    // 这里应该调用API获取真实数据
    // 暂时使用模拟数据
    const mockCategories = [
      { id: 1, name: '气候变化', description: '关于全球气候变化的文章', articleCount: 15 },
      { id: 2, name: '城市化', description: '城市发展与城市化进程', articleCount: 22 },
      { id: 3, name: '文化遗产', description: '世界文化遗产保护与研究', articleCount: 18 },
      { id: 4, name: '人口', description: '人口分布与增长趋势', articleCount: 12 },
      { id: 5, name: '自然资源', description: '自然资源分布与利用', articleCount: 9 }
    ];

    const mockTags = [
      { id: 1, name: '全球变暖', articleCount: 8 },
      { id: 2, name: '可持续发展', articleCount: 12 },
      { id: 3, name: '古城保护', articleCount: 6 },
      { id: 4, name: '人口老龄化', articleCount: 5 },
      { id: 5, name: '水资源', articleCount: 7 },
      { id: 6, name: '绿色能源', articleCount: 9 }
    ];

    setCategories(mockCategories);
    setTags(mockTags);
  }, []);

  // 分类管理功能
  const handleAddCategory = (e) => {
    e.preventDefault();
    
    // 这里应该调用API添加分类
    // 暂时模拟添加
    const categoryToAdd = {
      id: categories.length + 1,
      ...newCategory,
      articleCount: 0
    };
    
    setCategories([...categories, categoryToAdd]);
    setNewCategory({ name: '', description: '' });
    setShowAddCategoryModal(false);
  };

  const handleDeleteCategory = (id) => {
    // 这里应该调用API删除分类
    // 暂时模拟删除
    setCategories(categories.filter(category => category.id !== id));
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description
    });
    setShowEditCategoryModal(true);
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    
    // 这里应该调用API更新分类
    // 暂时模拟更新
    const updatedCategories = categories.map(category => {
      if (category.id === currentCategory.id) {
        return {
          ...category,
          ...newCategory
        };
      }
      return category;
    });
    
    setCategories(updatedCategories);
    setShowEditCategoryModal(false);
    setCurrentCategory(null);
    setNewCategory({ name: '', description: '' });
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  // 标签管理功能
  const handleAddTag = (e) => {
    e.preventDefault();
    
    // 这里应该调用API添加标签
    // 暂时模拟添加
    const tagToAdd = {
      id: tags.length + 1,
      ...newTag,
      articleCount: 0
    };
    
    setTags([...tags, tagToAdd]);
    setNewTag({ name: '' });
    setShowAddTagModal(false);
  };

  const handleDeleteTag = (id) => {
    // 这里应该调用API删除标签
    // 暂时模拟删除
    setTags(tags.filter(tag => tag.id !== id));
  };

  const handleEditTag = (tag) => {
    setCurrentTag(tag);
    setNewTag({
      name: tag.name
    });
    setShowEditTagModal(true);
  };

  const handleUpdateTag = (e) => {
    e.preventDefault();
    
    // 这里应该调用API更新标签
    // 暂时模拟更新
    const updatedTags = tags.map(tag => {
      if (tag.id === currentTag.id) {
        return {
          ...tag,
          ...newTag
        };
      }
      return tag;
    });
    
    setTags(updatedTags);
    setShowEditTagModal(false);
    setCurrentTag(null);
    setNewTag({ name: '' });
  };

  const handleTagInputChange = (e) => {
    const { name, value } = e.target;
    setNewTag(prev => ({ ...prev, [name]: value }));
  };

  return (
    <CMSLayout>
      <div className="categories-page">
        <h1>分类与标签管理</h1>
        <div className="content-container">
          {/* 分类管理 */}
          <div className="category-section">
            <div className="section-header">
              <h2>分类管理</h2>
              {checkActionPermission(loggedInUser, 'category', 'add') && (
                <button className="add-button" onClick={() => setShowAddCategoryModal(true)}>
                  + 添加分类
                </button>
              )}
            </div>
            
            <div className="categories-table-container">
              <table className="categories-table">
                <thead>
                  <tr>
                    <th>名称</th>
                    <th>描述</th>
                    <th>文章数量</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.id}>
                      <td className="category-name">{category.name}</td>
                      <td className="category-description">{category.description}</td>
                      <td className="article-count">{category.articleCount}</td>
                      <td className="actions">
                        {checkActionPermission(loggedInUser, 'category', 'edit') && (
                          <button className="edit-button" onClick={() => handleEditCategory(category)}>编辑</button>
                        )}
                        {checkActionPermission(loggedInUser, 'category', 'delete') && (
                          <button className="delete-button" onClick={() => handleDeleteCategory(category.id)}>
                            删除
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 标签管理 */}
          <div className="tag-section">
            <div className="section-header">
              <h2>标签管理</h2>
              {checkActionPermission(loggedInUser, 'category', 'add') && (
                <button className="add-button" onClick={() => setShowAddTagModal(true)}>
                  + 添加标签
                </button>
              )}
            </div>
            
            <div className="tags-container">
              <div className="tags-list">
                {tags.map(tag => (
                  <div key={tag.id} className="tag-item">
                    <div className="tag-info">
                      <span className="tag-name">{tag.name}</span>
                      <span className="tag-count">{tag.articleCount} 篇文章</span>
                    </div>
                    <div className="tag-actions">
                      {checkActionPermission(loggedInUser, 'category', 'edit') && (
                        <button className="edit-button" onClick={() => handleEditTag(tag)}>编辑</button>
                      )}
                      {checkActionPermission(loggedInUser, 'category', 'delete') && (
                        <button className="delete-button" onClick={() => handleDeleteTag(tag.id)}>
                          删除
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 添加分类模态框 */}
        {showAddCategoryModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>添加新分类</h2>
                <button className="close-button" onClick={() => setShowAddCategoryModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleAddCategory} className="category-form">
                <div className="form-group">
                  <label htmlFor="category-name">名称</label>
                  <input
                    type="text"
                    id="category-name"
                    name="name"
                    value={newCategory.name}
                    onChange={handleCategoryInputChange}
                    placeholder="请输入分类名称"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category-description">描述</label>
                  <textarea
                    id="category-description"
                    name="description"
                    value={newCategory.description}
                    onChange={handleCategoryInputChange}
                    placeholder="请输入分类描述"
                    rows={3}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={() => setShowAddCategoryModal(false)}>
                    取消
                  </button>
                  <button type="submit" className="save-button">
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 编辑分类模态框 */}
        {showEditCategoryModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>编辑分类</h2>
                <button className="close-button" onClick={() => setShowEditCategoryModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleUpdateCategory} className="category-form">
                <div className="form-group">
                  <label htmlFor="edit-category-name">名称</label>
                  <input
                    type="text"
                    id="edit-category-name"
                    name="name"
                    value={newCategory.name}
                    onChange={handleCategoryInputChange}
                    placeholder="请输入分类名称"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-category-description">描述</label>
                  <textarea
                    id="edit-category-description"
                    name="description"
                    value={newCategory.description}
                    onChange={handleCategoryInputChange}
                    placeholder="请输入分类描述"
                    rows={3}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={() => setShowEditCategoryModal(false)}>
                    取消
                  </button>
                  <button type="submit" className="save-button">
                    更新
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 添加标签模态框 */}
        {showAddTagModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>添加新标签</h2>
                <button className="close-button" onClick={() => setShowAddTagModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleAddTag} className="tag-form">
                <div className="form-group">
                  <label htmlFor="tag-name">名称</label>
                  <input
                    type="text"
                    id="tag-name"
                    name="name"
                    value={newTag.name}
                    onChange={handleTagInputChange}
                    placeholder="请输入标签名称"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={() => setShowAddTagModal(false)}>
                    取消
                  </button>
                  <button type="submit" className="save-button">
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 编辑标签模态框 */}
        {showEditTagModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>编辑标签</h2>
                <button className="close-button" onClick={() => setShowEditTagModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleUpdateTag} className="tag-form">
                <div className="form-group">
                  <label htmlFor="edit-tag-name">名称</label>
                  <input
                    type="text"
                    id="edit-tag-name"
                    name="name"
                    value={newTag.name}
                    onChange={handleTagInputChange}
                    placeholder="请输入标签名称"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={() => setShowEditTagModal(false)}>
                    取消
                  </button>
                  <button type="submit" className="save-button">
                    更新
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CMSLayout>
  );
}

export default CategoriesPage;