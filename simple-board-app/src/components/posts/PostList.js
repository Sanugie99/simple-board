import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getPosts, getPostsByCategory } from '../../api/postApi';
import { formatDate, getCategoryColor, CATEGORIES, sortPostsByPriority } from '../../utils/commonUtils';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './PostList.css';

const PostList = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      if (selectedCategory === '전체') {
        response = await getPosts(null, 0, 10, user?.userId);
      } else {
        response = await getPostsByCategory(selectedCategory, 0, 10, user?.userId);
      }
      
      // response가 존재하고 content가 있는지 확인
      if (response && response.content) {
        const sortedPosts = sortPostsByPriority(response.content);
        setPosts(sortedPosts);
      } else {
        // content가 없어도 빈 배열로 설정
        setPosts([]);
      }
    } catch (error) {
      console.error('게시글 로딩 오류:', error);
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };



  if (isLoading) {
    return (
      <div className="post-list-container">
        <LoadingSpinner message="게시글을 불러오는 중..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-list-container">
        <ErrorMessage message={error} onRetry={fetchPosts} />
      </div>
    );
  }

  return (
    <div className="post-list-container">
      <div className="post-list-header">
        <h2>게시글 목록</h2>
        <div className="category-filter">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              style={{
                backgroundColor: selectedCategory === category ? getCategoryColor(category) : 'transparent',
                color: selectedCategory === category ? 'white' : getCategoryColor(category),
                borderColor: getCategoryColor(category)
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="no-posts">
          <p>게시글이 없습니다.</p>
        </div>
      ) : (
        <div className="post-list">
          {posts.map(post => (
            <div key={post.id} className="post-item">
              <div className="post-header">
                <div className="post-category">
                  <span 
                    className="category-badge"
                    style={{ backgroundColor: getCategoryColor(post.category) }}
                  >
                    {post.category}
                  </span>
                </div>
                <div className="post-meta">
                  <span className="post-author">{post.authorName}</span>
                  <span className="post-date">{formatDate(post.createdAt)}</span>
                </div>
              </div>
              
              <Link to={`/post/${post.id}`} className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">
                  {post.content && post.content.length > 100 
                    ? `${post.content.substring(0, 100)}...` 
                    : post.content || '내용이 없습니다.'
                  }
                </p>
              </Link>
              
              <div className="post-footer">
                <div className="post-stats">
                  <span className="stat">
                    <span className="stat-icon">👁️</span>
                    {post.viewCount || 0}
                  </span>
                  <span className="stat">
                    <span className="stat-icon">💬</span>
                    {post.commentCount || 0}
                  </span>
                  <span className="stat">
                    <span className="stat-icon">⭐</span>
                    {post.scrapCount || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList; 