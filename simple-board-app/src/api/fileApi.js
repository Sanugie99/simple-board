// 파일 업로드 관련 API 함수들
import { API_BASE_URL } from '../config/apiConfig';

// 파일 업로드
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error('파일 업로드 오류:', error);
    throw error;
  }
};

// 파일 삭제
export const deleteFile = async (fileUrl) => {
  try {
    const response = await fetch(`${API_BASE_URL}/files/delete?fileUrl=${encodeURIComponent(fileUrl)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('파일 삭제 오류:', error);
    throw error;
  }
}; 