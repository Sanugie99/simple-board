import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserInfo } from '../api/userApi';
import { getUserPosts, getScrappedPosts } from '../api/postApi';
import ProfileEditModal from '../components/mypage/ProfileEditModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatDate, getCategoryDisplayName } from '../utils/commonUtils';
import './MyPage.css';

const MyPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [scrappedPosts, setScrappedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    console.log('MyPage useEffect 실행');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    console.log('user?.userId:', user?.userId);
    
    // 사용자가 로그인되어 있는지 확인
    if (!isAuthenticated || !user || !user.userId) {
      console.log('로그인 상태 확인 실패');
      setError('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      setIsLoading(false);
      // 로그인 페이지로 리다이렉트
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }
    
    console.log('로그인 상태 확인 성공, fetchUserData 호출');
    fetchUserData();
  }, [user, isAuthenticated]);

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    
    console.log('마이페이지 데이터 로딩 시작, userId:', user?.userId);
    
    try {
      // 사용자 정보, 작성한 글, 스크랩한 글을 병렬로 가져오기
      console.log('API 호출 시작...');
      const [userInfoResponse, postsResponse, scrappedResponse] = await Promise.all([
        getUserInfo(user.userId),
        getUserPosts(user.userId),
        getScrappedPosts(user.userId)
      ]);

      console.log('사용자 정보 응답:', userInfoResponse);
      console.log('글 목록 응답:', postsResponse);
      console.log('스크랩 목록 응답:', scrappedResponse);

      if (userInfoResponse && userInfoResponse.id) {
        setUserInfo(userInfoResponse);
      } else {
        console.error('사용자 정보 응답에 id가 없음:', userInfoResponse);
        throw new Error('사용자 정보를 가져올 수 없습니다.');
      }

      if (postsResponse && postsResponse.content) {
        setUserPosts(postsResponse.content);
      } else {
        console.log('글 목록이 비어있거나 응답 형식이 다름:', postsResponse);
        setUserPosts([]);
      }

      if (scrappedResponse && scrappedResponse.content) {
        setScrappedPosts(scrappedResponse.content);
      } else {
        console.log('스크랩 목록이 비어있거나 응답 형식이 다름:', scrappedResponse);
        setScrappedPosts([]);
      }
    } catch (error) {
      console.error('사용자 데이터 로딩 오류:', error);
      setError(`사용자 정보를 불러오는 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="mypage-container">
        <LoadingSpinner message="사용자 정보를 불러오는 중..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mypage-container">
        <ErrorMessage message={error} onRetry={fetchUserData} />
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <div className="mypage-header">
        <h2>마이페이지</h2>
      </div>

      {/* 사용자 프로필 카드 */}
      <div className="profile-card">
        <div className="profile-avatar">
          <span className="avatar-text">
            {userInfo?.name ? userInfo.name.charAt(0) : 'U'}
          </span>
        </div>
        <div className="profile-info">
          <h3 className="profile-name">{userInfo?.name || '사용자'}</h3>
          <p className="profile-id">@{userInfo?.userId || 'unknown'}</p>
          <p className="profile-email">{userInfo?.email || '-'}</p>
          <button className="edit-profile-button" onClick={handleEditProfile}>
            정보 수정
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          기본 정보
        </button>
        <button
          className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => handleTabChange('posts')}
        >
          작성한 글 ({userPosts.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'scraps' ? 'active' : ''}`}
          onClick={() => handleTabChange('scraps')}
        >
          스크랩한 글 ({scrappedPosts.length})
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">아이디</span>
              <span className="detail-value">{userInfo?.userId || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">이름</span>
              <span className="detail-value">{userInfo?.name || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">이메일</span>
              <span className="detail-value">{userInfo?.email || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">가입일</span>
              <span className="detail-value">
                {userInfo?.createdAt 
                  ? new Date(userInfo.createdAt).toLocaleDateString('ko-KR')
                  : '-'
                }
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">작성한 글 수</span>
              <span className="detail-value">{userPosts.length}개</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">스크랩한 글 수</span>
              <span className="detail-value">{scrappedPosts.length}개</span>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="user-posts">
            {userPosts.length === 0 ? (
              <div className="empty-state">
                <p>아직 작성한 글이 없습니다.</p>
              </div>
            ) : (
              <div className="posts-list">
                {userPosts.map((post) => (
                  <div key={post.id} className="post-item">
                    <Link to={`/post/${post.id}`} className="post-content">
                      <div className="post-header">
                        <h4 className="post-title">{post.title}</h4>
                        <span className={`category-badge ${post.category ? post.category.toLowerCase() : ''}`}>
                          {post.categoryName || getCategoryDisplayName(post.category)}
                        </span>
                      </div>
                      <div className="post-meta">
                        <span className="post-date">{formatDate(post.createdAt)}</span>
                        <div className="post-stats">
                          <span className="stat">👁️ {post.viewCount || 0}</span>
                          <span className="stat">💬 {post.commentCount || 0}</span>
                          <span className="stat">⭐ {post.scrapCount || 0}</span>
                        </div>
                      </div>
                    </Link>
                    <div className="post-actions">
                      <Link to={`/edit-post/${post.id}`} className="edit-button">
                        수정
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'scraps' && (
          <div className="scrapped-posts">
            {scrappedPosts.length === 0 ? (
              <div className="empty-state">
                <p>아직 스크랩한 글이 없습니다.</p>
              </div>
            ) : (
              <div className="posts-list">
                {scrappedPosts.map((post) => (
                  <Link key={post.id} to={`/post/${post.id}`} className="post-item">
                    <div className="post-header">
                      <h4 className="post-title">{post.title}</h4>
                      <span className={`category-badge ${post.category ? post.category.toLowerCase() : ''}`}>
                        {post.categoryName || getCategoryDisplayName(post.category)}
                      </span>
                    </div>
                    <div className="post-meta">
                      <span className="post-author">작성자: {post.authorName}</span>
                      <span className="post-date">{formatDate(post.createdAt)}</span>
                      <div className="post-stats">
                        <span className="stat">👁️ {post.viewCount || 0}</span>
                        <span className="stat">💬 {post.commentCount || 0}</span>
                        <span className="stat">⭐ {post.scrapCount || 0}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 정보 수정 모달 */}
      <ProfileEditModal
        userInfo={userInfo}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdate={fetchUserData}
      />
    </div>
  );
};

export default MyPage; 