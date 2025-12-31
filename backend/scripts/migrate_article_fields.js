const { executeQuery } = require('../services/dbConnection.js');

async function migrateDatabase() {
  try {
    console.log('开始数据库迁移...');

    const columns = [
      { name: 'author_name', type: 'VARCHAR(100)', default: '"文旅达人"', comment: '作者名称' },
      { name: 'views', type: 'INT', default: '0', comment: '阅读量' },
      { name: 'culture_background', type: 'TEXT', default: null, comment: '文化背景介绍' },
      { name: 'opening_hours', type: 'VARCHAR(100)', default: null, comment: '开放时间' },
      { name: 'ticket_price', type: 'VARCHAR(100)', default: null, comment: '门票价格' },
      { name: 'transportation', type: 'TEXT', default: null, comment: '交通方式' },
      { name: 'video_url', type: 'VARCHAR(500)', default: null, comment: '视频URL' },
      { name: 'culture_tips', type: 'TEXT', default: null, comment: '文化小贴士' }
    ];

    for (const column of columns) {
      try {
        const checkSql = `
          SELECT COUNT(*) as count 
          FROM information_schema.columns 
          WHERE table_schema = DATABASE() 
          AND table_name = 'article' 
          AND column_name = '${column.name}'
        `;
        const result = await executeQuery(checkSql);
        
        if (result[0].count === 0) {
          const defaultClause = column.default ? `DEFAULT ${column.default}` : '';
          const commentClause = column.comment ? `COMMENT '${column.comment}'` : '';
          const migration = `ALTER TABLE article ADD COLUMN ${column.name} ${column.type} ${defaultClause} ${commentClause}`;
          
          await executeQuery(migration);
          console.log(`✓ 添加字段: ${column.name}`);
        } else {
          console.log(`⊘ 字段已存在，跳过: ${column.name}`);
        }
      } catch (error) {
        console.error(`✗ 处理字段 ${column.name} 失败:`, error.message);
      }
    }

    console.log('\n数据库迁移完成！');
  } catch (error) {
    console.error('数据库迁移失败:', error);
    process.exit(1);
  }
}

migrateDatabase();
