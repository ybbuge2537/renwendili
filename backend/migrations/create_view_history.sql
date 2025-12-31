-- 创建浏览历史表
-- 用于记录用户的浏览行为，实现24小时内同一用户多次浏览只算一次阅读

CREATE TABLE IF NOT EXISTS view_history (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '浏览历史ID',
  article_id INT NOT NULL COMMENT '文章ID',
  user_identifier VARCHAR(255) NOT NULL COMMENT '用户标识（IP地址或用户ID）',
  view_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '浏览时间',
  INDEX idx_article_user (article_id, user_identifier, view_time),
  INDEX idx_view_time (view_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='浏览历史表';
