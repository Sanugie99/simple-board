// 사용자 관련 API 함수들
import { API_BASE_URL } from '../config/apiConfig';

// 백엔드 API 사용
const USE_MOCK_API = false;

// 사용자 정보 조회
export const getUserInfo = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/info?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
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