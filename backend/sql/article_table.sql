-- 创建文章表
CREATE TABLE IF NOT EXISTS article (
  article_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '文章ID',
  title VARCHAR(255) NOT NULL COMMENT '文章标题',
  content TEXT NOT NULL COMMENT '文章内容',
  author_id INT NOT NULL COMMENT '作者ID',
  region_id INT DEFAULT NULL COMMENT '地域ID',
  status ENUM('published', 'draft', 'pending') DEFAULT 'draft' COMMENT '文章状态',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (author_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (region_id) REFERENCES region(region_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

-- 创建文章标签表
CREATE TABLE IF NOT EXISTS article_tag (
  article_id INT NOT NULL COMMENT '文章ID',
  tag_name VARCHAR(50) NOT NULL COMMENT '标签名称',
  PRIMARY KEY (article_id, tag_name),
  FOREIGN KEY (article_id) REFERENCES article(article_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章标签表';

-- 创建文章封面表
CREATE TABLE IF NOT EXISTS article_cover (
  cover_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '封面ID',
  article_id INT NOT NULL COMMENT '文章ID',
  image_url VARCHAR(255) NOT NULL COMMENT '图片URL',
  is_primary BOOLEAN DEFAULT FALSE COMMENT '是否为主封面',
  FOREIGN KEY (article_id) REFERENCES article(article_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章封面表';
