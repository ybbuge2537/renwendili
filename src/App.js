import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import DashboardPage from './pages/cms/DashboardPage.js';
import ArticlesPage from './pages/cms/ArticlesPage.js';
import MediaPage from './pages/cms/MediaPage.js';
import CategoriesPage from './pages/cms/CategoriesPage.js';
import UsersPage from './pages/cms/UsersPage.js';
import RolesPage from './pages/cms/RolesPage.js';
import SystemSettingsPage from './pages/cms/SystemSettingsPage.js';
import RegisterPage from './pages/user/RegisterPage.js';
import LoginPage from './pages/user/LoginPage.js';
import UserProfilePage from './pages/user/UserProfilePage.js';
import TopNav from './components/Navigation/TopNav.js';
import HamburgerMenu from './components/Navigation/HamburgerMenu.js';
import MobileBottomNav from './components/Navigation/MobileBottomNav.js';
import Breadcrumb from './components/Navigation/Breadcrumb.js';

// 首页子页面
import HomeCarouselPage from './pages/home/HomeCarouselPage.js';
import HomeRecommendationsPage from './pages/home/HomeRecommendationsPage.js';
import HomeQuickAccessPage from './pages/home/HomeQuickAccessPage.js';

// 知识资源子页面
import KnowledgeRegionalPage from './pages/knowledge/KnowledgeRegionalPage.js';
import KnowledgeCulturalPage from './pages/knowledge/KnowledgeCulturalPage.js';
import KnowledgeEconomicPage from './pages/knowledge/KnowledgeEconomicPage.js';
import KnowledgeHistoryPage from './pages/knowledge/KnowledgeHistoryPage.js';
import KnowledgeGraphPage from './pages/knowledge/KnowledgeGraphPage.js';
import KnowledgeResourcesPage from './pages/knowledge/KnowledgeResourcesPage.js';
import TourismTemplatePage from './pages/knowledge/TourismTemplatePage.js';

// 知识资源三级页面
import RegionalChinaPage from './pages/knowledge/regional/RegionalChinaPage.js';
import RegionalWorldPage from './pages/knowledge/regional/RegionalWorldPage.js';
import CulturalCustomsPage from './pages/knowledge/cultural/CulturalCustomsPage.js';
import CulturalArchitecturePage from './pages/knowledge/cultural/CulturalArchitecturePage.js';
import CulturalLanguagePage from './pages/knowledge/cultural/CulturalLanguagePage.js';

// 社区互动子页面
import CommunityQAPage from './pages/community/CommunityQAPage.js';
import CommunityForumPage from './pages/community/CommunityForumPage.js';
import CommunityGroupsPage from './pages/community/CommunityGroupsPage.js';

// 创作中心子页面
import CreationArticlePage from './pages/creation/CreationArticlePage.js';
import CreationResourcePage from './pages/creation/CreationResourcePage.js';
import CreationDraftsPage from './pages/creation/CreationDraftsPage.js';

// 个人中心子页面
import ProfileContentPage from './pages/user/profile/ProfileContentPage.js';
import ProfileCollectionsPage from './pages/user/profile/ProfileCollectionsPage.js';
import ProfilePointsPage from './pages/user/profile/ProfilePointsPage.js';
import ProfileSettingsPage from './pages/user/profile/ProfileSettingsPage.js';

// 关于平台子页面
import AboutIntroPage from './pages/about/AboutIntroPage.js';
import AboutGuidePage from './pages/about/AboutGuidePage.js';
import AboutFeedbackPage from './pages/about/AboutFeedbackPage.js';
import AboutContactPage from './pages/about/AboutContactPage.js';
// 文章详情页
import ArticleDetailPage from './pages/ArticleDetailPage.js';
import ArticleBrowsePage from './pages/ArticleBrowsePage.js';

// 登录模态框组件
const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const navigate = useNavigate();

  // 自定义登录成功处理
  const handleLoginSuccess = (user) => {
    if (onLoginSuccess) {
      onLoginSuccess(user);
    }
    onClose();
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <LoginPage onLoginSuccess={handleLoginSuccess} onClose={onClose} />
    </div>
  );
};

function App() {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  // 登录模态框状态
  const [showLoginModal, setShowLoginModal] = useState(false);
  // 登录状态
  const [loggedInUser, setLoggedInUser] = useState(null);

  // 初始化登录状态
  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setLoggedInUser(JSON.parse(user));
    }
  }, []);

  // 处理汉堡菜单的打开和关闭
  const handleHamburgerClick = () => {
    setIsHamburgerOpen(true);
  };

  const handleCloseHamburger = () => {
    setIsHamburgerOpen(false);
  };

  // 处理登录模态框的显示
  const handleShowLoginModal = () => {
    setShowLoginModal(true);
  };

  // 处理登录模态框的隐藏
  const handleHideLoginModal = () => {
    setShowLoginModal(false);
  };

  // 处理登录成功
  const handleLoginSuccess = (user) => {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    setLoggedInUser(user);
  };

  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
  };

  return (
    <Router>
      <div className="app">
        {/* 顶部导航栏 */}
        <TopNav 
          onHamburgerClick={handleHamburgerClick} 
          onShowLoginModal={handleShowLoginModal}
          loggedInUser={loggedInUser}
          onLogout={handleLogout}
        />
        
        {/* 汉堡菜单 */}
        <HamburgerMenu isOpen={isHamburgerOpen} onClose={handleCloseHamburger} />
        
        {/* 面包屑导航 */}
        <Breadcrumb />
        
        {/* 主要内容区域 */}
        <main className="main-content">
          <Routes>
            {/* 首页 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home/carousel" element={<HomeCarouselPage />} />
            <Route path="/home/recommendations" element={<HomeRecommendationsPage />} />
            <Route path="/home/quick-access" element={<HomeQuickAccessPage />} />
            
            {/* 知识资源 */}
            <Route path="/knowledge" element={<KnowledgeRegionalPage />} />
            <Route path="/knowledge/regional" element={<KnowledgeRegionalPage />} />
            <Route path="/knowledge/regional/china" element={<RegionalChinaPage />} />
            <Route path="/knowledge/regional/world" element={<RegionalWorldPage />} />
            <Route path="/knowledge/cultural" element={<KnowledgeCulturalPage />} />
            <Route path="/knowledge/cultural/customs" element={<CulturalCustomsPage />} />
            <Route path="/knowledge/cultural/architecture" element={<CulturalArchitecturePage />} />
            <Route path="/knowledge/cultural/language" element={<CulturalLanguagePage />} />
            <Route path="/knowledge/economic" element={<KnowledgeEconomicPage />} />
            <Route path="/knowledge/history" element={<KnowledgeHistoryPage />} />
            <Route path="/knowledge/graph" element={<KnowledgeGraphPage />} />
            <Route path="/knowledge/resources" element={<KnowledgeResourcesPage />} />
            <Route path="/knowledge/tourism" element={<TourismTemplatePage />} />
            
            {/* 社区互动 */}
            <Route path="/community" element={<CommunityQAPage />} />
            <Route path="/community/qa" element={<CommunityQAPage />} />
            <Route path="/community/forum" element={<CommunityForumPage />} />
            <Route path="/community/groups" element={<CommunityGroupsPage />} />
            
            {/* 创作中心 */}
            <Route path="/creation" element={<CreationArticlePage />} />
            <Route path="/creation/article" element={<CreationArticlePage />} />
            <Route path="/creation/resource" element={<CreationResourcePage />} />
            <Route path="/creation/drafts" element={<CreationDraftsPage />} />
            
            {/* 文章详情页 */}
            <Route path="/article/:id" element={<ArticleBrowsePage />} />
            
            {/* 个人中心 */}
            <Route path="/user/register" element={<RegisterPage />} />
            <Route path="/user/login" element={<LoginPage />} />
            <Route path="/user/profile" element={<UserProfilePage />} />
            <Route path="/user/profile/content" element={<ProfileContentPage />} />
            <Route path="/user/profile/collections" element={<ProfileCollectionsPage />} />
            <Route path="/user/profile/points" element={<ProfilePointsPage />} />
            <Route path="/user/profile/settings" element={<ProfileSettingsPage />} />
            
            {/* 关于平台 */}
            <Route path="/about" element={<AboutIntroPage />} />
            <Route path="/about/intro" element={<AboutIntroPage />} />
            <Route path="/about/guide" element={<AboutGuidePage />} />
            <Route path="/about/feedback" element={<AboutFeedbackPage />} />
            <Route path="/about/contact" element={<AboutContactPage />} />
            
            {/* CMS后台 */}
            <Route path="/cms/login" element={<LoginPage />} />
            <Route path="/cms/dashboard" element={<DashboardPage />} />
            <Route path="/cms/articles" element={<ArticlesPage />} />
            <Route path="/cms/media" element={<MediaPage />} />
            <Route path="/cms/categories" element={<CategoriesPage />} />
            <Route path="/cms/users" element={<UsersPage />} />
            <Route path="/cms/roles" element={<RolesPage />} />
            <Route path="/cms/settings" element={<SystemSettingsPage />} />
          </Routes>
        </main>
        
        {/* 移动端底部导航 */}
        <MobileBottomNav />
        
        {/* 登录模态框 */}
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={handleHideLoginModal} 
          onLoginSuccess={handleLoginSuccess} 
        />
      </div>
    </Router>
  );
}

export default App;