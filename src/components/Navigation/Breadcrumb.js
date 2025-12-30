import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigationMenu } from '../../data/navigation';

const Breadcrumb = () => {
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const location = useLocation();

  // 根据当前路径生成面包屑
  useEffect(() => {
    const path = location.pathname;
    const items = [];

    // 始终添加首页
    items.push({ name: '首页', path: '/' });

    // 解析当前路径，查找匹配的菜单项
    const parsePath = (currentPath, menus) => {
      for (const menu of menus) {
        if (menu.path === currentPath) {
          items.push({ name: menu.name, path: menu.path });
          return true;
        }

        if (menu.children && currentPath.startsWith(menu.path)) {
          items.push({ name: menu.name, path: menu.path });
          if (parsePath(currentPath, menu.children)) {
            return true;
          }
          // 如果没有找到匹配的子项，移除当前菜单项
          items.pop();
        }
      }
      return false;
    };

    // 从一级菜单开始查找
    parsePath(path, navigationMenu);

    // 如果没有找到完整匹配，尝试根据路径段生成面包屑
    if (items.length === 1 && path !== '/') {
      const pathSegments = path.split('/').filter(segment => segment);
      let currentPath = '';
      
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        items.push({ 
          name: segment.charAt(0).toUpperCase() + segment.slice(1), 
          path: currentPath 
        });
      });
    }

    setBreadcrumbItems(items);
  }, [location.pathname]);

  return (
    <div className="breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="breadcrumb-separator">→</span>}
          {index === breadcrumbItems.length - 1 ? (
            <span className="breadcrumb-item active">{item.name}</span>
          ) : (
            <Link to={item.path} className="breadcrumb-item">
              {item.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
