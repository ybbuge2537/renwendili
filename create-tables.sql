-- 创建数据库表结构脚本
-- 基于《全球人文地理知识共享平台数据库设计文档》

-- 创建用户表
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` INT(11) PRIMARY KEY AUTO_INCREMENT COMMENT '用户唯一ID',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希（MD5+盐）',
  `email` VARCHAR(100) UNIQUE COMMENT '邮箱（可选）',
  `phone` VARCHAR(20) UNIQUE COMMENT '手机号（可选）',
  `role` ENUM('普通用户','认证用户','编辑','管理员') NOT NULL DEFAULT '普通用户' COMMENT '权限角色',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 创建地域表
CREATE TABLE IF NOT EXISTS `region` (
  `region_id` INT(11) PRIMARY KEY AUTO_INCREMENT COMMENT '地域唯一ID',
  `region_name` VARCHAR(100) NOT NULL COMMENT '地域名称（如“中国”）',
  `parent_id` INT(11) DEFAULT 0 COMMENT '父地域ID（顶级为0）',
  `location` POINT NOT NULL COMMENT '经纬度（空间类型）',
  `population` BIGINT COMMENT '人口数量',
  `language` VARCHAR(50) COMMENT '主要语言',
  `description` TEXT COMMENT '地域描述',
  FOREIGN KEY (`parent_id`) REFERENCES `region`(`region_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='地域表';

-- 为地域表添加空间索引
CREATE SPATIAL INDEX `idx_region_location` ON `region`(`location`);

-- 创建专题表
CREATE TABLE IF NOT EXISTS `topic` (
  `topic_id` INT(11) PRIMARY KEY AUTO_INCREMENT COMMENT '专题唯一ID',
  `title` VARCHAR(200) NOT NULL COMMENT '专题标题',
  `cover_url` VARCHAR(255) COMMENT '封面图片URL（OSS地址）',
  `content` TEXT NOT NULL COMMENT '专题内容（Markdown格式）',
  `region_id` INT(11) COMMENT '关联地域ID',
  `author_id` INT(11) NOT NULL COMMENT '作者ID',
  `status` ENUM('草稿','已发布','已下架') NOT NULL DEFAULT '草稿' COMMENT '专题状态',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (`region_id`) REFERENCES `region`(`region_id`) ON DELETE SET NULL,
  FOREIGN KEY (`author_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='专题表';

-- 为专题表添加索引
CREATE INDEX `idx_topic_region_id` ON `topic`(`region_id`);
CREATE INDEX `idx_topic_author_id` ON `topic`(`author_id`);
CREATE INDEX `idx_topic_create_time` ON `topic`(`create_time`);

-- 创建用户贡献表
CREATE TABLE IF NOT EXISTS `user_contribution` (
  `contribution_id` INT(11) PRIMARY KEY AUTO_INCREMENT COMMENT '贡献唯一ID',
  `user_id` INT(11) NOT NULL COMMENT '提交用户ID',
  `region_id` INT(11) COMMENT '关联地域ID',
  `content_type` ENUM('文字','图片','视频') NOT NULL COMMENT '内容类型',
  `content` TEXT COMMENT '文字内容（图片/视频时为空）',
  `media_url` VARCHAR(255) COMMENT '媒体URL（OSS地址）',
  `status` ENUM('待审核','审核通过','审核拒绝') NOT NULL DEFAULT '待审核' COMMENT '审核状态',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `audit_time` DATETIME COMMENT '审核时间',
  `auditor_id` INT(11) COMMENT '审核员ID',
  FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`region_id`) REFERENCES `region`(`region_id`) ON DELETE SET NULL,
  FOREIGN KEY (`auditor_id`) REFERENCES `user`(`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户贡献表';

-- 为用户贡献表添加索引
CREATE INDEX `idx_contribution_user_id` ON `user_contribution`(`user_id`);
CREATE INDEX `idx_contribution_region_id` ON `user_contribution`(`region_id`);
CREATE INDEX `idx_contribution_status` ON `user_contribution`(`status`);

-- 创建收藏表
CREATE TABLE IF NOT EXISTS `collection` (
  `collection_id` INT(11) PRIMARY KEY AUTO_INCREMENT COMMENT '收藏唯一ID',
  `user_id` INT(11) NOT NULL COMMENT '用户ID',
  `target_type` ENUM('专题','贡献内容') NOT NULL COMMENT '目标类型',
  `target_id` INT(11) NOT NULL COMMENT '目标ID（专题/贡献ID）',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_collection_user_target` (`user_id`,`target_type`,`target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- 创建点赞表
CREATE TABLE IF NOT EXISTS `like` (
  `like_id` INT(11) PRIMARY KEY AUTO_INCREMENT COMMENT '点赞唯一ID',
  `user_id` INT(11) NOT NULL COMMENT '用户ID',
  `target_type` ENUM('专题','贡献内容') NOT NULL COMMENT '目标类型',
  `target_id` INT(11) NOT NULL COMMENT '目标ID（专题/贡献ID）',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_like_user_target` (`user_id`,`target_type`,`target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞表';

-- 插入初始数据（可选）
INSERT INTO `user` (`username`, `password_hash`, `email`, `role`) VALUES
('admin', 'e10adc3949ba59abbe56e057f20f883e', 'admin@example.com', '管理员'),
('user1', 'e10adc3949ba59abbe56e057f20f883e', 'user1@example.com', '普通用户');

-- 提示
SELECT '数据库表结构创建完成！' AS message;
