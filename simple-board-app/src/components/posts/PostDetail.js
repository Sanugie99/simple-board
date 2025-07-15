import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostDetail, toggleScrap } from '../../api/postApi';
import { useAuth } from '../../contexts/AuthContext';
import { base64ToFile, formatFileSize } from '../../utils/fileUtils';
import './PostDetail.css';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrapped, setIsScrapped] = useState(false);

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  const fetchPostDetail = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getPostDetail(postId, user?.userId);
      if (response.id) {
        setPost(response);
        setIsScrapped(response.isScrapped || false);
      } else {
        setError('게시글을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrap = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await toggleScrap(postId, user.userId);
      if (response.isScrapped !== undefined) {
        setIsScrapped(response.isScrapped);
        setPost(prev => ({
          ...prev,
          scrapCount: response.isScrapped ? prev.scrapCount + 1 : prev.scrapCount - 1
        }));
      } else {
        alert(response.message || '스크랩 처리에 실패했습니다.');
      }
    } catch (error) {
      alert('스크랩 처리 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'DEV': '#007bff',
      'GENERAL': '#28a745',
      'QNA': '#ffc107',
      'NOTICE': '#dc3545'
    };
    return colors[category] || '#6c757d';
  };

  const downloadFile = (file) => {
    try {
      const blob = base64ToFile(file.base64, file.name, file.type);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="post-detail-container">
        <div className="loading">게시글을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-detail-container">
        <div className="error-message">
          {error}
          <button onClick={fetchPostDetail} className="retry-button">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail-container">
        <div className="error-message">게시글을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <div className="post-detail-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← 뒤로가기
        </button>
      </div>

      <article className="post-detail">
        <header className="post-header">
          <div className="post-title-section">
            <span 
              className="category-badge"
              style={{ backgroundColor: getCategoryColor(post.category) }}
            >
              {post.category}
            </span>
            <h1 className="post-title">{post.title}</h1>
          </div>
          <div className="post-meta">
            <div className="post-info">
              <span className="post-author">작성자: {post.authorName}</span>
              <span className="post-date">작성일: {formatDate(post.createdAt)}</span>
            </div>
            <div className="post-stats">
              <span className="stat">
                <span className="stat-icon">👁️</span>
                조회 {post.viewCount || 0}
              </span>
              <span className="stat">
                <span className="stat-icon">💬</span>
                댓글 {post.commentCount || 0}
              </span>
              <span className="stat">
                <span className="stat-icon">⭐</span>
                스크랩 {post.scrapCount || 0}
              </span>
            </div>
          </div>
        </header>

        <div className="post-content">
          <div className="content-text">
            {post.content.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>

        {post.fileUrls && post.fileUrls.length > 0 && (
          <div className="post-files">
            <h3>첨부파일</h3>
            <div className="file-list">
              {post.fileUrls.map((fileUrl, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <span className="file-name">파일 {index + 1}</span>
                  </div>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-button"
                  >
                    다운로드
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {post.comments && post.comments.length > 0 && (
          <div className="post-comments">
            <h3>댓글 ({post.comments.length})</h3>
            <div className="comment-list">
              {post.comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">{comment.authorName}</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                  <div className="comment-content">
                    {comment.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="post-actions">
          <button
            onClick={handleScrap}
            className={`scrap-button ${isScrapped ? 'scrapped' : ''}`}
          >
            {isScrapped ? '스크랩 취소' : '스크랩'}
          </button>
        </div>
      </article>
    </div>
  );
};

export default PostDetail; 