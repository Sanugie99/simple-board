/**
 * 공통 유틸리티
 */

/**
 * 날짜 포맷팅
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * 카테고리 색상
 */
export const getCategoryColor = (category) => {
  const colors = {
    'DEV': '#007bff',
    'GENERAL': '#28a745',
    'QNA': '#ffc107',
    'NOTICE': '#dc3545',
    '개발': '#007bff',
    '일반': '#28a745',
    '질문': '#ffc107',
    '공지': '#dc3545'
  };
  return colors[category] || '#6c757d';
};

/** 카테고리 목록 (한글) */
export const CATEGORIES = ['전체', '개발', '일반', '질문', '공지'];

/**
 * 카테고리 표시명
 */
export const getCategoryDisplayName = (category) => {
  const categoryMap = {
    'DEV': '개발',
    'GENERAL': '일반',
    'QNA': '질문',
    'NOTICE': '공지'
  };
  return categoryMap[category] || category;
};

/**
 * 게시글 정렬
 */
export const sortPostsByPriority = (posts) => {
  if (!posts || !Array.isArray(posts)) {
    return [];
  }
  
  const noticePosts = posts.filter(post => post && (post.category === 'NOTICE' || post.category === '공지'));
  const regularPosts = posts.filter(post => post && post.category !== 'NOTICE' && post.category !== '공지');
  
  const latestNotice = noticePosts.length > 0 
    ? [noticePosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]]
    : [];
  
  const sortedRegularPosts = regularPosts.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  return [...latestNotice, ...sortedRegularPosts];
};

// 확인 다이얼로그
export const confirmAction = (message) => {
  return window.confirm(message);
};

// 성공 메시지 표시
export const showSuccess = (message) => {
  alert(message);
};

// 에러 메시지 표시
export const showError = (message) => {
  alert(message);
};

/**
 * 로컬 스토리지
 */
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }
}; 