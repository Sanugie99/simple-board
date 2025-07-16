// 입력 검증 관련 유틸리티 함수들

// 이메일 형식 검증
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호 형식 검증 (8자 이상, 영문+숫자+특수문자 조합)
export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

// 아이디 형식 검증 (4-20자, 영문+숫자)
export const validateUserId = (userId) => {
  const userIdRegex = /^[A-Za-z0-9]{4,20}$/;
  return userIdRegex.test(userId);
};

// 이름 형식 검증 (2-10자, 한글+영문)
export const validateName = (name) => {
  const nameRegex = /^[가-힣A-Za-z]{2,10}$/;
  return nameRegex.test(name);
};

// 제목 검증 (1-100자)
export const validateTitle = (title) => {
  return title.length >= 1 && title.length <= 100;
};

// 내용 검증 (1-10000자) - HTML 태그 제거 후 텍스트 길이 계산
export const validateContent = (content) => {
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  return textContent.length >= 1 && textContent.length <= 10000;
};

// 카테고리 검증
export const validateCategory = (category) => {
  const validCategories = ['DEV', 'GENERAL', 'QNA', 'NOTICE'];
  return validCategories.includes(category);
};

// 전체 폼 검증
export const validateForm = (formData, formType, fields = null) => {
  const errors = {};

  switch (formType) {
    case 'login':
      if (!formData.userId) errors.userId = '아이디를 입력해주세요.';
      if (!formData.password) errors.password = '비밀번호를 입력해주세요.';
      break;

    case 'signup':
      // 특정 필드만 검증하는 경우
      if (fields) {
        if (fields.includes('userId')) {
          if (!formData.userId) {
            errors.userId = '아이디를 입력해주세요.';
          } else if (!validateUserId(formData.userId)) {
            errors.userId = '아이디는 4-20자의 영문과 숫자만 사용 가능합니다.';
          }
        }
        
        if (fields.includes('email')) {
          if (!formData.email) {
            errors.email = '이메일을 입력해주세요.';
          } else if (!validateEmail(formData.email)) {
            errors.email = '올바른 이메일 형식을 입력해주세요.';
          }
        }
        
        if (fields.includes('password')) {
          if (!formData.password) {
            errors.password = '비밀번호를 입력해주세요.';
          } else if (!validatePassword(formData.password)) {
            errors.password = '비밀번호는 8자 이상, 영문+숫자+특수문자 조합이어야 합니다.';
          }
        }
        
        if (fields.includes('passwordConfirm')) {
          if (!formData.passwordConfirm) {
            errors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
          } else if (formData.password !== formData.passwordConfirm) {
            errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
          }
        }
        
        if (fields.includes('name')) {
          if (!formData.name) {
            errors.name = '이름을 입력해주세요.';
          } else if (!validateName(formData.name)) {
            errors.name = '이름은 2-10자의 한글 또는 영문만 사용 가능합니다.';
          }
        }
      } else {
        // 전체 폼 검증
        if (!formData.userId) {
          errors.userId = '아이디를 입력해주세요.';
        } else if (!validateUserId(formData.userId)) {
          errors.userId = '아이디는 4-20자의 영문과 숫자만 사용 가능합니다.';
        }
        
        if (!formData.email) {
          errors.email = '이메일을 입력해주세요.';
        } else if (!validateEmail(formData.email)) {
          errors.email = '올바른 이메일 형식을 입력해주세요.';
        }
        
        if (!formData.password) {
          errors.password = '비밀번호를 입력해주세요.';
        } else if (!validatePassword(formData.password)) {
          errors.password = '비밀번호는 8자 이상, 영문+숫자+특수문자 조합이어야 합니다.';
        }
        
        if (!formData.passwordConfirm) {
          errors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
        } else if (formData.password !== formData.passwordConfirm) {
          errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
        }
        
        if (!formData.name) {
          errors.name = '이름을 입력해주세요.';
        } else if (!validateName(formData.name)) {
          errors.name = '이름은 2-10자의 한글 또는 영문만 사용 가능합니다.';
        }
      }
      break;

    case 'post':
      if (!formData.category) {
        errors.category = '카테고리를 선택해주세요.';
      } else if (!validateCategory(formData.category)) {
        errors.category = '올바른 카테고리를 선택해주세요.';
      }
      
      if (!formData.title) {
        errors.title = '제목을 입력해주세요.';
      } else if (!validateTitle(formData.title)) {
        errors.title = '제목은 1-100자로 입력해주세요.';
      }
      
      if (!formData.content) {
        errors.content = '내용을 입력해주세요.';
      } else if (!validateContent(formData.content)) {
        errors.content = '내용은 1-10000자로 입력해주세요.';
      }
      break;

    case 'password':
      if (formData.password && !validatePassword(formData.password)) {
        errors.password = '비밀번호는 8자 이상, 영문+숫자+특수문자 조합이어야 합니다.';
      }
      
      if (formData.password && !formData.passwordConfirm) {
        errors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
      } else if (formData.password && formData.password !== formData.passwordConfirm) {
        errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
      }
      break;

    case 'profile':
      if (!formData.name) {
        errors.name = '이름을 입력해주세요.';
      } else if (!validateName(formData.name)) {
        errors.name = '이름은 2-10자의 한글 또는 영문만 사용 가능합니다.';
      }
      
      if (!formData.email) {
        errors.email = '이메일을 입력해주세요.';
      } else if (!validateEmail(formData.email)) {
        errors.email = '올바른 이메일 형식을 입력해주세요.';
      }
      break;

    default:
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 