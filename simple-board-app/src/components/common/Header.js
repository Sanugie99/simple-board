import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            Simple Board
          </Link>
        </div>
        
        {/* 모바일 메뉴 버튼 */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="메뉴 열기"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <nav className={`header-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>
            홈
          </Link>
          {isAuthenticated && (
            <Link to="/create-post" className="nav-link" onClick={closeMobileMenu}>
              글쓰기
            </Link>
          )}
        </nav>
        
        <div className="header-right">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">{user?.name}님</span>
              <Link to="/mypage" className="nav-link" onClick={closeMobileMenu}>
                마이페이지
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                로그아웃
              </button>
            </div>
          ) : (
            <div className="auth-menu">
              <Link to="/login" className="nav-link" onClick={closeMobileMenu}>
                로그인
              </Link>
              <Link to="/signup" className="nav-link signup-link" onClick={closeMobileMenu}>
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