import { environment } from '../../../environment/environment';

export const API_BASE_URL = environment.apiUrl;

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
} as const;

export const STORAGE_KEYS = {
  JWT_TOKEN: environment.jwtTokenKey,
  USER_INFO: 'ambulance_user_info',
  REMEMBER_ME: 'ambulance_remember_me',
  THEME: 'ambulance_theme',
} as const;
