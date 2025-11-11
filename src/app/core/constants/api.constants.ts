import { environment } from '../../../environment/environment';

export const API_BASE_URL = environment.apiUrl;

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
} as const;
