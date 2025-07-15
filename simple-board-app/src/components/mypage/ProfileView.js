import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserInfo } from '../../api/userApi';
import { useAsync } from '../../hooks/useAsync';
import { confirmAction } from '../../utils/commonUtils';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './Mypage.css';

const ProfileView = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const { isLoading, error, execute: executeAsync } = useAsync();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await executeAsync(() => getUserInfo(user.userId));
      if (response.id) {
        setUserInfo(response);
      } else {
        throw new Error('사용자 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      throw new Error('사용자 정보를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = () => {
    if (confirmAction('정말 로그아웃하시겠습니까?')) {
      logout();
      navigate('/login');
    }
  };

  const handleDeleteAccount = () => {
    if (confirmAction('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      navigate('/mypage/delete');
    }
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
        <ErrorMessage message={error} onRetry={fetchUserInfo} />
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <div className="mypage-header">
        <h2>마이페이지</h2>
      </div>

      <div className="profile-section">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <span className="avatar-text">
                {userInfo?.name ? userInfo.name.charAt(0) : 'U'}
              </span>
            </div>
            <div className="profile-info">
              <h3 className="profile-name">{userInfo?.name || '사용자'}</h3>
              <p className="profile-id">@{userInfo?.userId || 'unknown'}</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">아이디</span>
              <span className="detail-value">{userInfo?.userId || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">이메일</span>
              <span className="detail-value">{userInfo?.email || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">이름</span>
              <span className="detail-value">{userInfo?.name || '-'}</span>
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
          </div>
        </div>
      </div>

      <div className="action-section">
        <div className="action-buttons">
          <button
            onClick={() => navigate('/mypage/edit')}
            className="action-button primary"
          >
            정보 수정
          </button>
          <button
            onClick={handleLogout}
            className="action-button secondary"
          >
            로그아웃
          </button>
          <button
            onClick={handleDeleteAccount}
            className="action-button danger"
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView; 