import React, { useState } from 'react';
import ArticleEditor from '../../components/ArticleEditor';

const CreationArticlePage = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveArticle = (article) => {
    // 这里应该调用API保存文章
    console.log('保存文章:', article);
    
    // 模拟保存成功
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleCancel = () => {
    // 取消编辑，返回上一页
    window.history.back();
  };

  return (
    <div className="creation-article-page">
      <div className="page-header">
        <h1>发布文章</h1>
        <p>使用富文本编辑器创作和发布地理相关的文章</p>
      </div>

      {showSuccess && (
        <div className="success-message">
          文章保存成功！
        </div>
      )}

      <ArticleEditor
        initialArticle={{
          title: '',
          content: '',
          category: '',
          tags: '',
          region: '',
          status: 'draft',
          coverImage: '',
          coordinates: null,
          trackData: []
        }}
        onSave={handleSaveArticle}
        onCancel={handleCancel}
      />

      <style jsx>{`
        .creation-article-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .page-header {
          margin-bottom: 30px;
          text-align: center;
        }

        .page-header h1 {
          color: #333;
          margin-bottom: 10px;
        }

        .page-header p {
          color: #666;
          font-size: 16px;
        }

        .success-message {
          background-color: #d4edda;
          color: #155724;
          padding: 12px 20px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
          border: 1px solid #c3e6cb;
        }

        @media (max-width: 768px) {
          .creation-article-page {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default CreationArticlePage;