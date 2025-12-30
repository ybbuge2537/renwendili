import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import CMSLogin from './pages/CMSLogin.js';
import CMSDashboard from './pages/CMSDashboard.js';
import CMSLocationManagement from './pages/CMSLocationManagement.js';
import CMSArticleManagement from './pages/CMSArticleManagement.js';
import CMSMediaManagement from './pages/CMSMediaManagement.js';
import CMSCategoryManagement from './pages/CMSCategoryManagement.js';
import CMSTagManagement from './pages/CMSTagManagement.js';
import CMSUserManagement from './pages/CMSUserManagement.js';
import CMSRoleManagement from './pages/CMSRoleManagement.js';
import UserRegister from './pages/UserRegister.js';
import UserLogin from './pages/UserLogin.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage isUserLoggedIn={isUserLoggedIn} />} />
          <Route 
            path="/cms/login" 
            element={<CMSLogin onLogin={setIsLoggedIn} />} 
          />
          <Route 
            path="/cms/dashboard" 
            element={isLoggedIn ? <CMSDashboard /> : <CMSLogin onLogin={setIsLoggedIn} />} 
          />
          <Route 
            path="/cms/locations" 
            element={isLoggedIn ? <CMSLocationManagement /> : <CMSLogin onLogin={setIsLoggedIn} />} 
          />
          <Route 
            path="/cms/articles" 
            element={isLoggedIn ? <CMSArticleManagement /> : <CMSLogin onLogin={setIsLoggedIn} />} 
          />
          <Route 
            path="/cms/media" 
            element={isLoggedIn ? <CMSMediaManagement /> : <CMSLogin onLogin={setIsLoggedIn} />} 
          />
          <Route 
            path="/cms/categories" 
            element={isLoggedIn ? <CMSCategoryManagement /> : <CMSLogin onLogin={setIsLoggedIn} />} 
          />
          <Route 
            path="/cms/tags" 
            element={isLoggedIn ? <CMSTagManagement /> : <CMSLogin onLogin={setIsLoggedIn} />} 
          />
          <Route 
            path="/cms/users" 
            element={isLoggedIn ? <CMSUserManagement /> : <CMSLogin onLogin={setIsLoggedIn} />} 
          />
          <Route 
            path="/cms/roles" 
            element={isLoggedIn ? <CMSRoleManagement /> : <CMSLogin onLogin={setIsLoggedIn} />} 
          />
          <Route 
            path="/user/register" 
            element={<UserRegister onRegister={() => setIsUserLoggedIn(true)} />} 
          />
          <Route 
            path="/user/login" 
            element={<UserLogin onLogin={setIsUserLoggedIn} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;