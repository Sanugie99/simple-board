import { useState } from 'react';

// 폼 상태 관리를 위한 공통 훅
export const useForm = (initialData = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 입력 필드 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 시 해당 필드의 에러 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 폼 데이터 직접 설정
  const setFormField = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 에러 설정
  const setFieldError = (name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // 전체 에러 설정
  const setFormErrors = (errors) => {
    setErrors(errors);
  };

  // 폼 초기화
  const resetForm = (newData = {}) => {
    setFormData(newData);
    setErrors({});
    setIsLoading(false);
  };

  // 로딩 상태 관리
  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    formData,
    errors,
    isLoading,
    handleInputChange,
    setFormField,
    setFieldError,
    setFormErrors,
    resetForm,
    startLoading,
    stopLoading
  };
}; 