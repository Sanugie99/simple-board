import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { checkId, checkPassword, login } from '../../api/authApi';
import { validateForm } from '../../utils/validationUtils';
import { useForm } from '../../hooks/useForm';
import { useAsync } from '../../hooks/useAsync';
import './AuthForms.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { formData, errors, isLoading, handleInputChange, setFormErrors, startLoading, stopLoading } = useForm({
    userId: '',
    password: ''
  });
  const { execute: executeAsync } = useAsync();
  const [step, setStep] = useState(1); // 1: 아이디 입력, 2: 비밀번호 입력

  const handleIdCheck = async () => {
    const validation = validateForm(formData, 'login');
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    try {
      const response = await executeAsync(() => checkId(formData.userId));
      if (response.success) {
        setStep(2);
        setFormErrors({});
      } else {
        setFormErrors({ userId: response.message || '존재하지 않는 아이디입니다.' });
      }
    } catch (error) {
      setFormErrors({ userId: '아이디 확인 중 오류가 발생했습니다.' });
    }
  };

  const handlePasswordCheck = async () => {
    if (!formData.password) {
      setFormErrors({ password: '비밀번호를 입력해주세요.' });
      return;
    }

    try {
      const response = await executeAsync(() => checkPassword(formData.userId, formData.password));
      if (response.success) {
        // 로그인 처리
        await handleLogin();
      } else {
        setFormErrors({ password: response.message || '비밀번호가 일치하지 않습니다.' });
      }
    } catch (error) {
      setFormErrors({ password: '비밀번호 확인 중 오류가 발생했습니다.' });
    }
  };

  const handleLogin = async () => {
    try {
      const result = await authLogin(formData.userId, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setFormErrors({ general: result.message || '로그인에 실패했습니다.' });
      }
    } catch (error) {
      setFormErrors({ general: '로그인 중 오류가 발생했습니다.' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      handleIdCheck();
    } else {
      handlePasswordCheck();
    }
  };

  const handleBack = () => {
    setStep(1);
    setFormField('password', '');
    setFormErrors({});
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
            disabled={step === 2}
            className={errors.userId ? 'error' : ''}
            placeholder="아이디를 입력하세요"
          />
          {errors.userId && <span className="error-text">{errors.userId}</span>}
        </div>

        {step === 2 && (
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
        )}

        <div className="form-actions">
          {step === 1 ? (
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? '확인 중...' : '다음'}
            </button>
          ) : (
            <div className="button-group">
              <button type="button" onClick={handleBack} className="btn-secondary">
                뒤로
              </button>
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </div>
          )}
        </div>

        <div className="auth-links">
          <span>계정이 없으신가요? </span>
          <button type="button" onClick={() => navigate('/signup')} className="link-button">
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; 