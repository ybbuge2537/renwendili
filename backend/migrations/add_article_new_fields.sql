-- 为 article 表添加新字段以支持文章编辑页面的新功能
-- 执行时间: 2024-12-30

-- 添加作者名称字段
ALTER TABLE article ADD COLUMN author_name VARCHAR(100) DEFAULT '文旅达人' COMMENT '作者名称';

-- 添加阅读量字段
ALTER TABLE article ADD COLUMN views INT DEFAULT 0 COMMENT '阅读量';

-- 添加文化背景字段
ALTER TABLE article ADD COLUMN culture_background TEXT COMMENT '文化背景介绍';

-- 添加开放时间字段
ALTER TABLE article ADD COLUMN opening_hours VARCHAR(100) COMMENT '开放时间';

-- 添加门票价格字段
ALTER TABLE article ADD COLUMN ticket_price VARCHAR(100) COMMENT '门票价格';

-- 添加交通方式字段
ALTER TABLE article ADD COLUMN transportation TEXT COMMENT '交通方式';

-- 添加视频URL字段
ALTER TABLE article ADD COLUMN video_url VARCHAR(500) COMMENT '视频URL';

-- 添加文化小贴士字段
ALTER TABLE article ADD COLUMN culture_tips TEXT COMMENT '文化小贴士';
