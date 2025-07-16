// 사용자 관련 API 함수들
import { API_BASE_URL } from '../config/apiConfig';

// 백엔드 API 사용
const USE_MOCK_API = false;

// 사용자 정보 조회
export const getUserInfo = async (userId) => {
  try {
    console.log('getUserInfo 호출, userId:', userId);
    console.log('API_BASE_URL:', API_BASE_URL);
    
    const url = `${API_BASE_URL}/user/info?userId=${userId}`;
    console.log('요청 URL:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('응답 상태:', response.status);
    console.log('응답 헤더:', response.headers);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('응답 데이터:', data);
    return data;
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    throw error;
  }
};

// 사용자 정보 수정
export const updateUserInfo = async (userData, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/update?userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error('사용자 정보 수정 오류:', error);
    throw error;
  }
};

// 회원 탈퇴
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/delete?userId=${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('회원 탈퇴 오류:', error);
    throw error;
  }
};

// 아이디 찾기
export const findUserId = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/find-id?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '아이디 찾기에 실패했습니다.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('아이디 찾기 오류:', error);
    throw error;
  }
};

// 비밀번호 확인
export const checkPassword = async (userId, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/check-password?userId=${encodeURIComponent(userId)}&password=${encodeURIComponent(password)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '비밀번호 확인에 실패했습니다.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('비밀번호 확인 오류:', error);
    throw error;
  }
};

// 비밀번호 재설정
export const resetPassword = async (userId, email, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/reset-password?userId=${encodeURIComponent(userId)}&email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPassword)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '비밀번호 재설정에 실패했습니다.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('비밀번호 재설정 오류:', error);
    throw error;
  }
}; 