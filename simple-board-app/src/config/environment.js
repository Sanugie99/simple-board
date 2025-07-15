// 환경 설정
const ENV = {
  // 개발 환경
  development: {
    API_BASE_URL: 'http://localhost:10000/api',
    NODE_ENV: 'development'
  },
  // 프로덕션 환경
  production: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:10000/api',
    NODE_ENV: 'production'
  }
};

// 현재 환경 감지
const getCurrentEnv = () => {
  return process.env.NODE_ENV || 'development';
};

// 현재 환경의 설정 반환
export const getEnvironmentConfig = () => {
  const currentEnv = getCurrentEnv();
  return ENV[currentEnv] || ENV.development;
};

// 환경별 API URL 반환
export const getApiUrl = () => {
  const config = getEnvironmentConfig();
  return config.API_BASE_URL;
};

// 환경 정보 반환
export const getEnvironment = () => {
  return getCurrentEnv();
};

export default ENV; 