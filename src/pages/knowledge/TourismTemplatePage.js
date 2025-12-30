import React from 'react';

// 模拟旅游地理数据
const tourismData = [
  {
    id: 1,
    title: '中国-长城',
    region: '中国',
    category: '历史文化',
    description: '万里长城是中国古代的军事防御工程，是世界七大奇迹之一。',
    image: 'https://picsum.photos/id/1018/800/450',
    views: 12345,
    likes: 987,
    comments: 123
  },
  {
    id: 2,
    title: '法国-埃菲尔铁塔',
    region: '法国',
    category: '地标建筑',
    description: '埃菲尔铁塔是法国巴黎的地标性建筑，是世界著名的旅游景点。',
    image: 'https://picsum.photos/id/1019/800/450',
    views: 23456,
    likes: 1876,
    comments: 234
  },
  {
    id: 3,
    title: '日本-富士山',
    region: '日本',
    category: '自然风光',
    description: '富士山是日本的最高峰，也是世界著名的火山之一。',
    image: 'https://picsum.photos/id/1025/800/450',
    views: 34567,
    likes: 2765,
    comments: 345
  },
  {
    id: 4,
    title: '埃及-金字塔',
    region: '埃及',
    category: '历史文化',
    description: '埃及金字塔是古埃及法老的陵墓，是世界七大奇迹之一。',
    image: 'https://picsum.photos/id/1029/800/450',
    views: 45678,
    likes: 3654,
    comments: 456
  },
  {
    id: 5,
    title: '美国-大峡谷',
    region: '美国',
    category: '自然风光',
    description: '美国大峡谷是世界上最壮观的自然奇观之一，拥有独特的地质景观。',
    image: 'https://picsum.photos/id/1039/800/450',
    views: 56789,
    likes: 4543,
    comments: 567
  },
  {
    id: 6,
    title: '意大利-罗马斗兽场',
    region: '意大利',
    category: '历史文化',
    description: '罗马斗兽场是古罗马时期最大的圆形角斗场，是古罗马文明的象征。',
    image: 'https://picsum.photos/id/1040/800/450',
    views: 67890,
    likes: 5432,
    comments: 678
  }
];

const TourismTemplatePage = () => {
  return (
    <div className="tourism-template-page">
      <div className="page-header">
        <h1>旅游地理</h1>
        <p>探索世界各地的旅游胜地和自然奇观</p>
      </div>
      
      <div className="tourism-card-grid">
        {tourismData.map((item) => (
          <div key={item.id} className="tourism-card">
            <div className="card-image">
              <img src={item.image} alt={item.title} />
              <div className="card-category">{item.category}</div>
            </div>
            
            <div className="card-content">
              <div className="card-header-info">
                <div className="card-region">{item.region}</div>
              </div>
              
              <h3 className="card-title">{item.title}</h3>
              <p className="card-description">{item.description}</p>
              
              <div className="card-stats">
                <span className="stat-item">
                  <i className="stat-icon">👁️</i>
                  {item.views.toLocaleString()}
                </span>
                <span className="stat-item">
                  <i className="stat-icon">❤️</i>
                  {item.likes.toLocaleString()}
                </span>
                <span className="stat-item">
                  <i className="stat-icon">💬</i>
                  {item.comments.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourismTemplatePage;
