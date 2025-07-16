import React, { useState } from 'react';
import { findUserId, resetPassword, checkPassword } from '../../api/userApi';
import './FindAccountModal.css';

const FindAccountModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('findId');
  const [formData, setFormData] = useState({
    email: '',
    userId: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [foundUserId, setFoundUserId] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 시 해당 필드의 에러 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateFindIdForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetPasswordForm = () => {
    const newErrors = {};
    
    if (!formData.userId.trim()) {
      newErrors.userId = '아이디를 입력해주세요.';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }
    
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요.';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = '비밀번호는 6자 이상이어야 합니다.';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFindId = async (e) => {
    e.preventDefault();
    
    if (!validateFindIdForm()) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await findUserId(formData.email);
      setFoundUserId(response.userId);
      setMessage(`아이디를 찾았습니다: ${response.userId}`);
    } catch (error) {
      setMessage(error.message || '아이디 찾기에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validateResetPasswordForm()) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // 기존 비밀번호와 동일한지 확인
      const passwordCheck = await checkPassword(formData.userId, formData.newPassword);
      if (passwordCheck.isMatch) {
        setMessage('기존에 사용중인 비밀번호입니다.');
        setIsLoading(false);
        return;
      }

      await resetPassword(formData.userId, formData.email, formData.newPassword);
      setMessage('비밀번호가 성공적으로 재설정되었습니다. 새로운 비밀번호로 로그인해주세요.');
      
      // 폼 초기화
      setFormData(prev => ({
        ...prev,
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setMessage(error.message || '비밀번호 재설정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // 폼 초기화
      setFormData({
        email: '',
        userId: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
      setMessage('');
      setFoundUserId('');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage('');
    setFoundUserId('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>계정 찾기</h3>
          <button className="modal-close" onClick={handleClose} disabled={isLoading}>
            ×
          </button>
        </div>

        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'findId' ? 'active' : ''}`}
            onClick={() => handleTabChange('findId')}
            disabled={isLoading}
          >
            아이디 찾기
          </button>
          <button
            className={`tab-button ${activeTab === 'resetPassword' ? 'active' : ''}`}
            onClick={() => handleTabChange('resetPassword')}
            disabled={isLoading}
          >
            비밀번호 재설정
          </button>
        </div>

        {activeTab === 'findId' && (
          <form onSubmit={handleFindId} className="find-account-form">
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="가입 시 사용한 이메일을 입력하세요"
                disabled={isLoading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {message && (
              <div className={`message ${message.includes('찾았습니다') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <div className="form-actions">
              <button type="button" onClick={handleClose} disabled={isLoading} className="cancel-button">
                취소
              </button>
              <button type="submit" disabled={isLoading} className="find-button">
                {isLoading ? '찾는 중...' : '아이디 찾기'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'resetPassword' && (
          <form onSubmit={handleResetPassword} className="find-account-form">
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
                disabled={isLoading}
              />
              {errors.userId && <span className="error-message">{errors.userId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="가입 시 사용한 이메일을 입력하세요"
                disabled={isLoading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">새 비밀번호</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={errors.newPassword ? 'error' : ''}
                placeholder="새 비밀번호를 입력하세요 (6자 이상)"
                disabled={isLoading}
              />
              {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">새 비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="새 비밀번호를 다시 입력하세요"
                disabled={isLoading}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            {message && (
              <div className={`message ${message.includes('성공') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <div className="form-actions">
              <button type="button" onClick={handleClose} disabled={isLoading} className="cancel-button">
                취소
              </button>
              <button type="submit" disabled={isLoading} className="reset-button">
                {isLoading ? '재설정 중...' : '비밀번호 재설정'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FindAccountModal; 