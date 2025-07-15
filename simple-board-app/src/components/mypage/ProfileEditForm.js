import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserInfo, updateUserInfo } from '../../api/userApi';
import { validateForm } from '../../utils/validationUtils';
import './Mypage.css';

const ProfileEditForm = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getUserInfo(user.userId);
      if (response.id) {
        setFormData({
          name: response.name || '',
          email: response.email || '',
          password: '',
          passwordConfirm: ''
        });
      } else {
        setError('사용자 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 비밀번호 변경 여부 확인
    const isPasswordChange = formData.password || formData.passwordConfirm;
    
    if (isPasswordChange) {
      // 비밀번호 변경 시 검증
      const passwordValidation = validateForm({
        password: formData.password,
        passwordConfirm: formData.passwordConfirm
      }, 'password');
      
      if (!passwordValidation.isValid) {
        setErrors(passwordValidation.errors);
        return;
      }
    }

    // 이름과 이메일 검증
    const nameEmailValidation = validateForm({
      name: formData.name,
      email: formData.email
    }, 'profile');
    
    if (!nameEmailValidation.isValid) {
      setErrors(nameEmailValidation.errors);
      return;
    }

    setIsSaving(true);
    
    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      const response = await updateUserInfo(updateData, user.userId);
      if (response.id) {
        // 로컬 상태 업데이트
        updateUser({
          ...user,
          name: formData.name,
          email: formData.email
        });
        
        alert('정보가 성공적으로 수정되었습니다.');
        navigate('/mypage');
      } else {
        setErrors({ general: response.message || '정보 수정에 실패했습니다.' });
      }
    } catch (error) {
      setErrors({ general: '정보 수정 중 오류가 발생했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('수정 중인 내용이 사라집니다. 정말 취소하시겠습니까?')) {
      navigate('/mypage');
    }
  };

  if (isLoading) {
    return (
      <div className="mypage-container">
        <div className="loading">사용자 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mypage-container">
        <div className="error-message">
          {error}
          <button onClick={fetchUserInfo} className="retry-button">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <div className="mypage-header">
        <h2>정보 수정</h2>
        <button onClick={handleCancel} className="cancel-button">
          취소
        </button>
      </div>

      <form onSubmit={handleSubmit} className="profile-edit-form">
        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">이름 *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
            placeholder="2-10자의 한글 또는 영문"
            maxLength={10}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일 *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
            placeholder="이메일을 입력하세요"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="password-section">
          <h3>비밀번호 변경 (선택사항)</h3>
          <p className="section-description">
            비밀번호를 변경하지 않으려면 비워두세요.
          </p>
          
          <div className="form-group">
            <label htmlFor="password">새 비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
              placeholder="8자 이상, 영문+숫자+특수문자 조합"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirm">새 비밀번호 확인</label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              className={errors.passwordConfirm ? 'error' : ''}
              placeholder="새 비밀번호를 다시 입력하세요"
            />
            {errors.passwordConfirm && <span className="error-text">{errors.passwordConfirm}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn-secondary">
            취소
          </button>
          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm; 