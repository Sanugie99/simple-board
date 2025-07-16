import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostDetail, toggleScrap } from '../../api/postApi';
import { useAuth } from '../../contexts/AuthContext';
import { getCategoryDisplayName } from '../../utils/commonUtils';
import CommentSection from './CommentSection';
import './PostDetail.css';

/**
 * 게시글 상세 페이지
 */

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
          if (!authLoading) {
        loadPost();
      }
  }, [postId, authLoading]);

  const loadPost = async () => {
    setIsLoading(true);
    setError(null);
    
    if (authLoading) {
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await getPostDetail(postId, user?.userId);
      if (response.id) {
        setPost(response);
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
        setPost(prev => ({
          ...prev,
          isScrapped: response.isScrapped,
          scrapCount: response.scrapCount || 0
        }));
      } else {
        alert(response.message || '스크랩 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('스크랩 처리 중 오류:', error);
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
          <button onClick={loadPost} className="retry-button">
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
              className={`category-badge ${post.category ? post.category.toLowerCase() : ''}`}
            >
              {post.categoryName || getCategoryDisplayName(post.category)}
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
          <div 
            className="content-text"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
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

                <div className="post-actions">
          <button
            onClick={handleScrap}
            className={`scrap-button ${post?.isScrapped === true ? 'scrapped' : ''}`}
          >
            {post?.isScrapped === true ? '스크랩 취소' : '스크랩'}
          </button>
        </div>
      </article>

      {/* 댓글 섹션 */}
      <CommentSection postId={postId} />
    </div>
  );
};

export default PostDetail; 