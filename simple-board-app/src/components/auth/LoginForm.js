import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../api/authApi';
import { validateForm } from '../../utils/validationUtils';
import { useForm } from '../../hooks/useForm';
import FindAccountModal from './FindAccountModal';
import './AuthForms.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { formData, errors, isLoading, handleInputChange, setFormErrors, startLoading, stopLoading } = useForm({
    userId: '',
    password: ''
  });
  const [isFindAccountModalOpen, setIsFindAccountModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateForm(formData, 'login');
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    startLoading();
    try {
      const result = await authLogin(formData.userId, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setFormErrors({ general: result.message || '로그인에 실패했습니다.' });
      }
    } catch (error) {
      setFormErrors({ general: '로그인 중 오류가 발생했습니다.' });
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>로그인</h2>
        
        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="userId">아이디</label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            className={errors.userId ? 'error' : ''}
            placeholder="아이디를 입력하세요"
          />
          {errors.userId && <span className="error-text">{errors.userId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={errors.password ? 'error' : ''}
            placeholder="비밀번호를 입력하세요"
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </div>

        <div className="auth-links">
          <div className="auth-link-group">
            <span>계정이 없으신가요? </span>
            <button type="button" onClick={() => navigate('/signup')} className="link-button">
              회원가입
            </button>
          </div>
          <div className="auth-link-group">
            <button type="button" onClick={() => setIsFindAccountModalOpen(true)} className="link-button">
              아이디/비밀번호 찾기
            </button>
          </div>
        </div>
      </form>

      <FindAccountModal
        isOpen={isFindAccountModalOpen}
        onClose={() => setIsFindAccountModalOpen(false)}
      />
    </div>
  );
};

export default LoginForm; 