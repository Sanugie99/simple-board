// 인증 관련 API 함수들
import { API_BASE_URL } from '../config/apiConfig';

// 백엔드 API 사용
const USE_MOCK_API = false;

// 로그인 관련 API
export const checkId = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    return await response.json();
  } catch (error) {
    console.error('아이디 확인 오류:', error);
    throw error;
  }
};

export const checkPassword = async (userId, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, password }),
    });
    return await response.json();
  } catch (error) {
    console.error('비밀번호 확인 오류:', error);
    throw error;
  }
};

export const login = async (userId, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, password }),
    });
    return await response.json();
  } catch (error) {
    console.error('로그인 오류:', error);
    throw error;
  }
};

// 회원가입 관련 API
export const checkEmail = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error) {
    console.error('이메일 중복 확인 오류:', error);
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error('회원가입 오류:', error);
    throw error;
  }
}; 