import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkId, checkEmail, signup } from '../../api/authApi';
import { validateForm } from '../../utils/validationUtils';
import './AuthForms.css';

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    passwordConfirm: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [checkedFields, setCheckedFields] = useState({
    userId: false,
    email: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 시 해당 필드의 에러만 초기화 (중복확인 상태는 유지)
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // 아이디나 이메일이 변경되면 중복확인 상태 초기화
    if ((name === 'userId' || name === 'email') && checkedFields[name]) {
      setCheckedFields(prev => ({
        ...prev,
        [name]: false
      }));
    }
    
    // 비밀번호 확인 필드가 변경되면 체크 상태 초기화
    if (name === 'passwordConfirm' && checkedFields.passwordConfirm) {
      setCheckedFields(prev => ({
        ...prev,
        passwordConfirm: false
      }));
    }
  };

  const handleIdCheck = async () => {
    if (!formData.userId) {
      setErrors(prev => ({ ...prev, userId: '아이디를 입력해주세요.' }));
      return;
    }

    const validation = validateForm({ userId: formData.userId }, 'signup', ['userId']);
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, ...validation.errors }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await checkId(formData.userId);
      if (response.success) {
        setCheckedFields(prev => ({ ...prev, userId: true }));
        setErrors(prev => ({ ...prev, userId: '' }));
      } else {
        setErrors(prev => ({ ...prev, userId: response.message || '이미 사용 중인 아이디입니다.' }));
        setCheckedFields(prev => ({ ...prev, userId: false }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, userId: '아이디 확인 중 오류가 발생했습니다.' }));
      setCheckedFields(prev => ({ ...prev, userId: false }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailCheck = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: '이메일을 입력해주세요.' }));
      return;
    }

    const validation = validateForm({ email: formData.email }, 'signup', ['email']);
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, ...validation.errors }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await checkEmail(formData.email);
      if (response.success) {
        setCheckedFields(prev => ({ ...prev, email: true }));
        setErrors(prev => ({ ...prev, email: '' }));
      } else {
        setErrors(prev => ({ ...prev, email: response.message || '이미 사용 중인 이메일입니다.' }));
        setCheckedFields(prev => ({ ...prev, email: false }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, email: '이메일 확인 중 오류가 발생했습니다.' }));
      setCheckedFields(prev => ({ ...prev, email: false }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateForm(formData, 'signup');
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, ...validation.errors }));
      return;
    }

    if (!checkedFields.userId) {
      setErrors(prev => ({ ...prev, userId: '아이디 중복 확인을 해주세요.' }));
      return;
    }

    if (!checkedFields.email) {
      setErrors(prev => ({ ...prev, email: '이메일 중복 확인을 해주세요.' }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await signup(formData);
      if (response.success !== false) {
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
        navigate('/login');
      } else {
        setErrors(prev => ({ ...prev, general: response.message || '회원가입에 실패했습니다.' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, general: '회원가입 중 오류가 발생했습니다.' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>회원가입</h2>
        
        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="userId">아이디</label>
          <div className="input-with-button">
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              className={errors.userId ? 'error' : ''}
              placeholder="4-20자의 영문과 숫자"
            />
            <button
              type="button"
              onClick={handleIdCheck}
              disabled={isLoading || checkedFields.userId}
              className="check-button"
            >
              {checkedFields.userId ? '확인됨' : '중복확인'}
            </button>
          </div>
          {errors.userId && <span className="error-text">{errors.userId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <div className="input-with-button">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="이메일을 입력하세요"
            />
            <button
              type="button"
              onClick={handleEmailCheck}
              disabled={isLoading || checkedFields.email}
              className="check-button"
            >
              {checkedFields.email ? '확인됨' : '중복확인'}
            </button>
          </div>
          {errors.email && <span className="error-text">{errors.email}</span>}
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
            placeholder="8자 이상, 영문+숫자+특수문자"
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleInputChange}
            className={errors.passwordConfirm ? 'error' : ''}
            placeholder="비밀번호를 다시 입력하세요"
          />
          {errors.passwordConfirm && <span className="error-text">{errors.passwordConfirm}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
            placeholder="2-10자의 한글 또는 영문"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? '가입 중...' : '회원가입'}
          </button>
        </div>

        <div className="auth-links">
          <span>이미 계정이 있으신가요? </span>
          <button type="button" onClick={() => navigate('/login')} className="link-button">
            로그인
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm; 