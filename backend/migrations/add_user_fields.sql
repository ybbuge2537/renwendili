-- 用户表字段扩展迁移脚本（简化版）
-- 基于《用户管理系统设计文档》完善用户表字段

-- 2. 添加基础信息字段
ALTER TABLE `user` ADD COLUMN `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称' AFTER `username`;
ALTER TABLE `user` ADD COLUMN `avatar_url` VARCHAR(255) DEFAULT NULL COMMENT '头像URL' AFTER `nickname`;

-- 3. 修改手机号字段长度
ALTER TABLE `user` MODIFY COLUMN `phone` VARCHAR(11) DEFAULT NULL COMMENT '手机号';

-- 4. 添加权限相关字段
ALTER TABLE `user` ADD COLUMN `role_id` INT DEFAULT NULL COMMENT '角色ID' AFTER `role`;
ALTER TABLE `user` ADD COLUMN `is_enabled` BOOLEAN DEFAULT TRUE COMMENT '是否启用' AFTER `role_id`;
ALTER TABLE `user` ADD COLUMN `custom_permissions` JSON DEFAULT NULL COMMENT '自定义权限' AFTER `is_enabled`;

-- 5. 添加扩展信息字段
ALTER TABLE `user` ADD COLUMN `travel_preferences` JSON DEFAULT NULL COMMENT '文旅偏好标签' AFTER `custom_permissions`;
ALTER TABLE `user` ADD COLUMN `certification_status` ENUM('未认证','文旅达人','机构账号') DEFAULT '未认证' COMMENT '认证状态' AFTER `travel_preferences`;
ALTER TABLE `user` ADD COLUMN `bio` TEXT DEFAULT NULL COMMENT '个人简介' AFTER `certification_status`;
ALTER TABLE `user` ADD COLUMN `residence` VARCHAR(100) DEFAULT NULL COMMENT '常住地' AFTER `bio`;

-- 6. 添加安全相关字段
ALTER TABLE `user` ADD COLUMN `salt` VARCHAR(32) DEFAULT NULL COMMENT '盐值' AFTER `password_hash`;
ALTER TABLE `user` ADD COLUMN `login_error_count` INT DEFAULT 0 COMMENT '登录错误次数' AFTER `salt`;
ALTER TABLE `user` ADD COLUMN `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP' AFTER `login_error_count`;
ALTER TABLE `user` ADD COLUMN `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间' AFTER `last_login_ip`;
ALTER TABLE `user` ADD COLUMN `login_count` INT DEFAULT 0 COMMENT '登录次数' AFTER `last_login_time`;
ALTER TABLE `user` ADD COLUMN `password_update_time` DATETIME DEFAULT NULL COMMENT '密码更新时间' AFTER `login_count`;

-- 7. 添加统计相关字段
ALTER TABLE `user` ADD COLUMN `article_count` INT DEFAULT 0 COMMENT '累计发布文章数' AFTER `password_update_time`;
ALTER TABLE `user` ADD COLUMN `video_count` INT DEFAULT 0 COMMENT '累计上传视频数' AFTER `article_count`;
ALTER TABLE `user` ADD COLUMN `like_count` INT DEFAULT 0 COMMENT '累计获赞数' AFTER `video_count`;
ALTER TABLE `user` ADD COLUMN `last_active_time` DATETIME DEFAULT NULL COMMENT '最后活跃时间' AFTER `like_count`;
ALTER TABLE `user` ADD COLUMN `collection_count` INT DEFAULT 0 COMMENT '累计收藏文章数' AFTER `last_active_time`;

-- 8. 添加系统相关字段
ALTER TABLE `user` ADD COLUMN `is_deleted` BOOLEAN DEFAULT FALSE COMMENT '删除状态（软删除）' AFTER `collection_count`;

-- 9. 添加索引
CREATE INDEX `idx_user_role_id` ON `user`(`role_id`);
CREATE INDEX `idx_user_certification_status` ON `user`(`certification_status`);
CREATE INDEX `idx_user_is_enabled` ON `user`(`is_enabled`);
CREATE INDEX `idx_user_is_deleted` ON `user`(`is_deleted`);

-- 10. 为已有用户设置默认昵称
UPDATE `user` SET `nickname` = `username` WHERE `nickname` IS NULL;

-- 提示
SELECT '用户表字段扩展完成！' AS message;
