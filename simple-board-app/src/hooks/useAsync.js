import { useState, useCallback } from 'react';

// 비동기 작업 관리를 위한 공통 훅
export const useAsync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 비동기 작업 실행 함수
  const execute = useCallback(async (asyncFunction) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err.message || '작업 중 오류가 발생했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 로딩 상태 강제 설정
  const setLoading = useCallback((loading) => {
    setIsLoading(loading);
  }, []);

  return {
    isLoading,
    error,
    execute,
    clearError,
    setLoading
  };
}; 