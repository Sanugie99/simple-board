import { API_BASE_URL } from '../config/apiConfig';

/**
 * 댓글 API
 */

/**
 * 댓글 작성
 */
export const createComment = async (postId, content, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '댓글 작성에 실패했습니다.');
    }
    
    return data;
  } catch (error) {
    console.error('댓글 작성 오류:', error);
    throw error;
  }
};

/**
 * 댓글 목록 조회
 */
export const getCommentsByPostId = async (postId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '댓글 목록 조회에 실패했습니다.');
    }
    
    return data;
  } catch (error) {
    console.error('댓글 목록 조회 오류:', error);
    throw error;
  }
};

/**
 * 댓글 수정
 */
export const updateComment = async (commentId, content, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '댓글 수정에 실패했습니다.');
    }
    
    return data;
  } catch (error) {
    console.error('댓글 수정 오류:', error);
    throw error;
  }
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (commentId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '댓글 삭제에 실패했습니다.');
    }
    
    return data;
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    throw error;
  }
};

/**
 * 사용자 댓글 목록 조회
 */
export const getCommentsByUserId = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '사용자 댓글 목록 조회에 실패했습니다.');
    }
    
    return data;
  } catch (error) {
    console.error('사용자 댓글 목록 조회 오류:', error);
    throw error;
  }
}; 