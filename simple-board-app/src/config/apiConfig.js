// API 설정
import { getApiUrl, getEnvironmentConfig } from './environment';

// API 기본 URL 반환
export const API_BASE_URL = getApiUrl();

// 전체 설정 객체 반환
export const getApiConfig = () => getEnvironmentConfig();

// API 설정 객체
const API_CONFIG = {
  API_BASE_URL: API_BASE_URL
};

export default API_CONFIG; 