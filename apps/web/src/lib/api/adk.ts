import { Axios } from 'axios';
import { env } from '../config/env';

export class Adk {
  axios: Axios;

  constructor(axiosInstance: Axios) {
    this.axios = axiosInstance;
  }

  async getSessions() {
    return this.axios.get(`${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/agents/sessions`);
  }

  async createSession() {
    return this.axios.post(`${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/agents/create-sessions`);
  }

  async startChat(data: {
    message: string;
    sessionId?: string;
    img?: Array<{
      name: string;
      type: string;
      size: number;
      path?: string;
      data: File | Blob | Buffer;
    }>;
  }) {
    return this.axios.post(`${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/agents/sessions`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async deleteSession(sessionId: string) {
    return this.axios.delete(
      `${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/agents/sessions/${sessionId}`
    );
  }
}
