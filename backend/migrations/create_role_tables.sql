-- 创建角色表和权限表
-- 基于RBAC权限模型设计

-- 创建角色表
CREATE TABLE IF NOT EXISTS `role` (
  `role_id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '角色ID',
  `role_name` VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名称',
  `role_description` TEXT DEFAULT NULL COMMENT '角色描述',
  `permissions` JSON DEFAULT NULL COMMENT '权限列表（JSON格式）',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 插入默认角色
INSERT INTO `role` (`role_name`, `role_description`, `permissions`) VALUES
('超级管理员', '拥有系统所有权限', '["*"]'),
('管理员', '拥有大部分管理权限', '["user.view","user.edit","user.delete","article.view","article.edit","article.delete","article.audit","region.view","region.edit","topic.view","topic.edit","topic.delete"]'),
('编辑', '可以编辑和管理内容', '["article.view","article.edit","article.create","topic.view","topic.edit","topic.create"]'),
('作者', '可以发布内容', '["article.view","article.create","article.edit_own","topic.view","topic.create","topic.edit_own"]'),
('查看者', '只能查看内容', '["article.view","topic.view"]');

-- 创建用户登录日志表
CREATE TABLE IF NOT EXISTS `user_login_log` (
  `log_id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '日志ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `login_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
  `login_ip` VARCHAR(50) DEFAULT NULL COMMENT '登录IP',
  `user_agent` VARCHAR(500) DEFAULT NULL COMMENT '用户代理（设备信息）',
  `login_status` ENUM('成功','失败') NOT NULL COMMENT '登录状态',
  `failure_reason` VARCHAR(200) DEFAULT NULL COMMENT '失败原因',
  FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户登录日志表';

-- 为登录日志表添加索引
CREATE INDEX `idx_login_log_user_id` ON `user_login_log`(`user_id`);
CREATE INDEX `idx_login_log_login_time` ON `user_login_log`(`login_time`);
CREATE INDEX `idx_login_log_login_status` ON `user_login_log`(`login_status`);

-- 创建用户操作日志表
CREATE TABLE IF NOT EXISTS `user_operation_log` (
  `log_id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '日志ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `operation_type` VARCHAR(50) NOT NULL COMMENT '操作类型',
  `operation_target` VARCHAR(100) DEFAULT NULL COMMENT '操作目标',
  `operation_detail` TEXT DEFAULT NULL COMMENT '操作详情',
  `ip_address` VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
  `operation_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户操作日志表';

-- 为操作日志表添加索引
CREATE INDEX `idx_operation_log_user_id` ON `user_operation_log`(`user_id`);
CREATE INDEX `idx_operation_log_operation_time` ON `user_operation_log`(`operation_time`);
CREATE INDEX `idx_operation_log_operation_type` ON `user_operation_log`(`operation_type`);

-- 提示
SELECT '角色表和日志表创建完成！' AS message;
