import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            Simple Board
          </Link>
        </div>
        
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            홈
          </Link>
          {isAuthenticated && (
            <Link to="/create-post" className="nav-link">
              글쓰기
            </Link>
          )}
        </nav>
        
        <div className="header-right">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">{user?.name}님</span>
              <Link to="/mypage" className="nav-link">
                마이페이지
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                로그아웃
              </button>
            </div>
          ) : (
            <div className="auth-menu">
              <Link to="/login" className="nav-link">
                로그인
              </Link>
              <Link to="/signup" className="nav-link signup-link">
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 