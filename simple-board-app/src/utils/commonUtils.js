// 날짜 포맷팅
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

// 카테고리 색상 반환
export const getCategoryColor = (category) => {
  const colors = {
    'DEV': '#007bff',
    'GENERAL': '#28a745',
    'QNA': '#ffc107',
    'NOTICE': '#dc3545'
  };
  return colors[category] || '#6c757d';
};

// 카테고리 목록
export const CATEGORIES = ['전체', 'DEV', 'GENERAL', 'QNA', 'NOTICE'];

// 게시글 정렬 (공지사항 우선)
export const sortPostsByPriority = (posts) => {
  // posts가 undefined이거나 배열이 아닌 경우 빈 배열 반환
  if (!posts || !Array.isArray(posts)) {
    return [];
  }
  
  // 공지사항과 일반 게시글 분리
  const noticePosts = posts.filter(post => post && post.category === 'NOTICE');
  const regularPosts = posts.filter(post => post && post.category !== 'NOTICE');
  
  // 공지사항 중 최신 1개만 선택
  const latestNotice = noticePosts.length > 0 
    ? [noticePosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]]
    : [];
  
  // 일반 게시글들을 최신순으로 정렬
  const sortedRegularPosts = regularPosts.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  // 최신 공지사항 1개 + 일반 게시글들 순서로 합치기
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

// 로컬 스토리지 관리
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