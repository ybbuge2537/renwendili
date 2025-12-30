import React, { useState, useEffect } from 'react';
import CMSNavbar from '../components/CMSNavbar.js';
import dataManager from '../data/dataManager.js';

const CMSCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    parent_id: null
  });

  useEffect(() => {
    const allCategories = dataManager.getAllCategories();
    setCategories(allCategories);
    setParentCategories(allCategories.filter(cat => cat.parent_id === null));
  }, []);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        slug: category.slug,
        parent_id: category.parent_id
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        slug: '',
        parent_id: null
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({
      ...prev,
      [name]: value === 'null' ? null : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCategory) {
      dataManager.updateCategory(editingCategory.id, categoryForm);
    } else {
      dataManager.addCategory(categoryForm);
    }
    
    setCategories(dataManager.getAllCategories());
    setParentCategories(dataManager.getAllCategories().filter(cat => cat.parent_id === null));
    handleCloseModal();
  };

  const handleDelete = (id) => {
    // 检查是否有子分类
    const hasChildren = categories.some(cat => cat.parent_id === id);
    if (hasChildren) {
      alert('该分类下有子分类，请先删除或迁移子分类');
      return;
    }
    
    // 检查是否有文章属于该分类
    const hasArticles = dataManager.getArticlesByCategory(id).length > 0;
    if (hasArticles) {
      alert('该分类下有文章，请先将文章迁移到其他分类');
      return;
    }
    
    if (window.confirm('确定要删除该分类吗？')) {
      dataManager.deleteCategory(id);
      setCategories(dataManager.getAllCategories());
      setParentCategories(dataManager.getAllCategories().filter(cat => cat.parent_id === null));
    }
  };

  const renderCategoriesTree = (parentId = null, level = 0) => {
    const categoryList = categories.filter(cat => cat.parent_id === parentId);
    
    if (categoryList.length === 0) return null;
    
    return (
      <ul className={`category-list level-${level}`}>
        {categoryList.map(category => (
          <li key={category.id} className="category-item">
            <div className="category-info">
              <span className="category-name">{category.name}</span>
              <span className="category-slug">({category.slug})</span>
            </div>
            <div className="category-actions">
              <button className="action-btn edit-btn" onClick={() => handleOpenModal(category)}>编辑</button>
              <button className="action-btn delete-btn" onClick={() => handleDelete(category.id)}>删除</button>
            </div>
            {renderCategoriesTree(category.id, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="cms-container">
      <CMSNavbar />
      <div className="cms-content">
        <div className="cms-sidebar">
          <h3>管理菜单</h3>
          <div className="cms-sidebar-nav">
            <a href="/cms/dashboard" className="cms-nav-link">仪表板</a>
            <a href="/cms/articles" className="cms-nav-link">文章管理</a>
            <a href="/cms/media" className="cms-nav-link">媒体管理</a>
            <a href="/cms/categories" className="cms-nav-link active">分类管理</a>
            <a href="/cms/tags" className="cms-nav-link">标签管理</a>
            <a href="/cms/locations" className="cms-nav-link">位置管理</a>
            <a href="/cms/users" className="cms-nav-link">用户管理</a>
            <a href="/cms/roles" className="cms-nav-link">角色管理</a>
            <a href="/cms/settings" className="cms-nav-link">系统设置</a>
            <a href="/" className="cms-nav-link">退出登录</a>
          </div>
        </div>
        <div className="cms-main-content">
          <div className="cms-card">
            <div className="card-header">
              <h2>分类管理</h2>
              <button className="btn btn-primary" onClick={() => handleOpenModal()}>添加分类</button>
            </div>
            <div className="card-body">
              <div className="categories-tree">
                {renderCategoriesTree()}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingCategory ? '编辑分类' : '添加分类'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label htmlFor="name">分类名称</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={categoryForm.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="slug">分类别名</label>
                <input 
                  type="text" 
                  id="slug" 
                  name="slug" 
                  value={categoryForm.slug}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="parent_id">父分类</label>
                <select 
                  id="parent_id" 
                  name="parent_id" 
                  value={categoryForm.parent_id === null ? 'null' : categoryForm.parent_id}
                  onChange={handleInputChange}
                >
                  <option value="null">无</option>
                  {parentCategories.map(category => (
                    <option 
                      key={category.id} 
                      value={category.id}
                      disabled={editingCategory && category.id === editingCategory.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>取消</button>
                <button type="submit" className="btn btn-primary">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSCategoryManagement;
