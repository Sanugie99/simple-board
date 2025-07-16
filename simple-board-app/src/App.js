import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/common/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import PostDetailPage from './pages/PostDetailPage';
import MyPage from './pages/MyPage';
import './App.css';

// 인증이 필요한 라우트를 보호하는 컴포넌트
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="loading">로딩 중...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// 로그인된 사용자가 접근할 수 없는 라우트를 보호하는 컴포넌트
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="loading">로딩 중...</div>;
  }
  
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const AppContent = () => {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/" element={<MainPage />} />
          <Route path="/post/:postId" element={<PostDetailPage />} />
          
          {/* 인증이 필요한 라우트 */}
          <Route 
            path="/create-post" 
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-post/:postId" 
            element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mypage/*" 
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 로그인/회원가입 라우트 (로그인된 사용자는 접근 불가) */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } 
          />
          
          {/* 404 페이지 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
