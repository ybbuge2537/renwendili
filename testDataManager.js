// 简化测试脚本 - 仅测试核心数据转换功能

// 测试地域数据转换
function testRegionConversion() {
  console.log('=== 测试地域数据转换功能 ===');
  
  // 创建测试地点对象
  const frontendLocation = {
    id: 'test_loc_001',
    name: { zh: '测试地点' },
    description: { zh: '这是一个测试地点' },
    coordinates: { lng: 116.3974, lat: 39.9093 },
    population: 1000000,
    language: '中文'
  };
  
  console.log('原始前端数据:', frontendLocation);
  
  // 前端到数据库转换
  const dbRegion = {
    region_id: frontendLocation.id,
    region_name: frontendLocation.name.zh,
    description: frontendLocation.description.zh || '',
    location: `POINT(${frontendLocation.coordinates.lng} ${frontendLocation.coordinates.lat})`,
    population: frontendLocation.population || null,
    language: frontendLocation.language || null,
    created_at: new Date().toISOString().replace('T', ' ').slice(0, -5),
    updated_at: new Date().toISOString().replace('T', ' ').slice(0, -5)
  };
  
  console.log('\n前端到数据库转换结果:', dbRegion);
  
  // 数据库到前端转换
  // 解析经纬度
  let coordinates = { lng: 0, lat: 0 };
  if (dbRegion.location) {
    const match = dbRegion.location.match(/POINT\((\d+\.?\d*) (\d+\.?\d*)\)/);
    if (match) {
      coordinates = { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
    }
  }
  
  const convertedFrontendLocation = {
    id: dbRegion.region_id,
    name: { zh: dbRegion.region_name },
    description: { zh: dbRegion.description || '' },
    coordinates: coordinates,
    population: dbRegion.population || null,
    language: dbRegion.language || null,
    layer: 'country', 
    type: 'country', 
    tags: [], 
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  console.log('\n数据库到前端转换结果:', convertedFrontendLocation);
  
  // 验证转换是否正确
  console.log('\n验证转换结果:');
  console.log('ID保持一致:', frontendLocation.id === convertedFrontendLocation.id);
  console.log('名称保持一致:', frontendLocation.name.zh === convertedFrontendLocation.name.zh);
  console.log('描述保持一致:', frontendLocation.description.zh === convertedFrontendLocation.description.zh);
  console.log('坐标保持一致:', frontendLocation.coordinates.lng === convertedFrontendLocation.coordinates.lng && frontendLocation.coordinates.lat === convertedFrontendLocation.coordinates.lat);
  console.log('人口保持一致:', frontendLocation.population === convertedFrontendLocation.population);
  console.log('语言保持一致:', frontendLocation.language === convertedFrontendLocation.language);
  
  console.log('\n地域数据转换测试完成！');
}

// 测试专题数据转换
function testTopicConversion() {
  console.log('\n=== 测试专题数据转换功能 ===');
  
  // 创建测试专题对象
  const frontendArticle = {
    id: 'test_art_001',
    title: { zh: '测试专题' },
    content: { zh: '这是一个测试专题内容' },
    location: { id: 'loc_001' },
    author: { id: 'user_001' },
    status: 'published'
  };
  
  console.log('原始前端数据:', frontendArticle);
  
  // 前端到数据库转换
  const dbTopic = {
    topic_id: frontendArticle.id,
    title: frontendArticle.title.zh,
    content: frontendArticle.content.zh,
    region_id: frontendArticle.location?.id || null,
    author_id: frontendArticle.author?.id || null,
    status: frontendArticle.status === 'published' ? '已发布' : '草稿',
    created_at: new Date().toISOString().replace('T', ' ').slice(0, -5),
    updated_at: new Date().toISOString().replace('T', ' ').slice(0, -5)
  };
  
  console.log('\n前端到数据库转换结果:', dbTopic);
  
  // 数据库到前端转换
  const convertedFrontendArticle = {
    id: dbTopic.topic_id,
    title: { zh: dbTopic.title },
    content: { zh: dbTopic.content },
    location: { id: dbTopic.region_id },
    author: { id: dbTopic.author_id },
    status: dbTopic.status === '已发布' ? 'published' : 'draft',
    created_at: new Date(dbTopic.created_at).toISOString(),
    updated_at: new Date(dbTopic.updated_at).toISOString()
  };
  
  console.log('\n数据库到前端转换结果:', convertedFrontendArticle);
  
  // 验证转换是否正确
  console.log('\n验证转换结果:');
  console.log('ID保持一致:', frontendArticle.id === convertedFrontendArticle.id);
  console.log('标题保持一致:', frontendArticle.title.zh === convertedFrontendArticle.title.zh);
  console.log('状态保持一致:', frontendArticle.status === convertedFrontendArticle.status);
  console.log('地域ID保持一致:', frontendArticle.location?.id === convertedFrontendArticle.location?.id);
  console.log('作者ID保持一致:', frontendArticle.author?.id === convertedFrontendArticle.author?.id);
  
  console.log('\n专题数据转换测试完成！');
}

// 运行测试
function runTests() {
  testRegionConversion();
  testTopicConversion();
  console.log('\n=== 所有测试完成！ ===');
}

runTests();
