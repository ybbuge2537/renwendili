-- 为文章表添加坐标和分类字段
ALTER TABLE article 
ADD COLUMN coordinates_lat DECIMAL(10, 8) DEFAULT NULL COMMENT '纬度',
ADD COLUMN coordinates_lng DECIMAL(11, 8) DEFAULT NULL COMMENT '经度',
ADD COLUMN category VARCHAR(50) DEFAULT 'culture' COMMENT '文章分类：culture(文化), history(历史), lifestyle(生活), base(基础)';
