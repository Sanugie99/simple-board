// 게시글 관련 API 함수들
import { API_BASE_URL } from '../config/apiConfig';

// 백엔드 API 사용
const USE_MOCK_API = false;

// 게시글 목록 조회
export const getPosts = async (category = null, page = 0, size = 10, userId = null) => {
  try {
    let url = `${API_BASE_URL}/posts?page=${page}&size=${size}`;
    if (category) {
      url += `&category=${category}`;
    }
    if (userId) {
      url += `&userId=${userId}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data || { content: [] };
  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    // 에러가 발생해도 기본 구조 반환
    return { content: [] };
  }
};

// 카테고리별 게시글 조회
export const getPostsByCategory = async (category, page = 0, size = 10, userId = null) => {
  try {
    let url = `${API_BASE_URL}/posts?category=${category}&page=${page}&size=${size}`;
    if (userId) {
      url += `&userId=${userId}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data || { content: [] };
  } catch (error) {
    console.error('카테고리별 게시글 조회 오류:', error);
    // 에러가 발생해도 기본 구조 반환
    return { content: [] };
  }
};

// 게시글 상세 조회
export const getPostDetail = async (postId, userId = null) => {
  try {
    let url = `${API_BASE_URL}/posts/${postId}`;
    if (userId) {
      url += `?userId=${userId}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('게시글 상세 조회 오류:', error);
    throw error;
  }
};

// 게시글 작성
export const createPost = async (postData, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    return await response.json();
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    throw error;
  }
};

// 스크랩 추가/제거
export const toggleScrap = async (postId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/scrap?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('스크랩 토글 오류:', error);
    throw error;
  }
}; 