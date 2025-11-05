import { Axios } from 'axios';
import { env } from '../config/env';

export class Auth {
  axios: Axios;

  constructor(axiosInstance: Axios) {
    this.axios = axiosInstance;
  }

  async signup(data: { name: string; email: string; password: string }, sessionId?: string) {
    const params = sessionId ? { sessionId } : undefined;
    return this.axios.post(`${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/auth/signup`, data, { params });
  }

  async signin(data: { email: string; password: string }, sessionId?: string) {
    const params = sessionId ? { sessionId } : undefined;
    return this.axios.post(`${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/auth/signin`, data, { params });
  }

  async googleSignIn(sessionId?: string) {
    const params = sessionId ? { sessionId } : undefined;
    return this.axios.get(`${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/auth/google`, { params });
  }

  async googleCallback(params: Record<string, string>) {
    return this.axios.get(`${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/auth/google/callback`, {
      params,
    });
  }
}
