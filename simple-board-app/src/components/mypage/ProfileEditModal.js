import React, { useState } from 'react';
import { updateUserInfo } from '../../api/userApi';
import './ProfileEditModal.css';

const ProfileEditModal = ({ userInfo, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    // 비밀번호 변경 시에만 검증
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
      }
      
      if (formData.newPassword && formData.newPassword.length < 6) {
        newErrors.newPassword = '새 비밀번호는 6자 이상이어야 합니다.';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = '새 비밀번호가 일치하지 않습니다.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 변경사항이 있는지 확인하는 함수
  const hasChanges = () => {
    // 이름이나 이메일이 변경되었는지 확인
    const nameChanged = formData.name !== (userInfo?.name || '');
    const emailChanged = formData.email !== (userInfo?.email || '');
    
    // 비밀번호 변경이 있는지 확인
    const passwordChanged = formData.newPassword && formData.newPassword.trim() !== '';
    
    return nameChanged || emailChanged || passwordChanged;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 변경사항이 없으면 메시지 표시 후 종료
    if (!hasChanges()) {
      setMessage('변경사항이 없습니다.');
      setTimeout(() => {
        setMessage('');
      }, 2000);
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      // 비밀번호 변경이 있는 경우에만 추가
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await updateUserInfo(userInfo.userId, updateData);
      
      if (response.success) {
        setMessage('정보가 성공적으로 업데이트되었습니다.');
        setTimeout(() => {
          onUpdate();
          onClose();
          // 폼 초기화
          setFormData({
            name: response.user?.name || formData.name,
            email: response.user?.email || formData.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          setMessage('');
        }, 1500);
      } else {
        setMessage(response.message || '정보 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('정보 업데이트 오류:', error);
      setMessage('정보 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // 폼 초기화
      setFormData({
        name: userInfo?.name || '',
        email: userInfo?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
      setMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>정보 수정</h3>
          <button className="modal-close" onClick={handleClose} disabled={isLoading}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
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
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="password-section">
            <h4>비밀번호 변경 (선택사항)</h4>
            
            <div className="form-group">
              <label htmlFor="currentPassword">현재 비밀번호</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className={errors.currentPassword ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
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
                disabled={isLoading}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          {message && (
            <div className={`message ${
              message.includes('성공') ? 'success' : 
              message.includes('변경사항이 없습니다') ? 'info' : 'error'
            }`}>
              {message}
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={handleClose} disabled={isLoading} className="cancel-button">
              취소
            </button>
            <button type="submit" disabled={isLoading} className="save-button">
              {isLoading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal; 