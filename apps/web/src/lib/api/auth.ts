import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

export async function signup(data: { name: string; email: string; password: string }) {
  return axios.post(`${API_URL}/api/auth/signup`, data);
}

export async function signin(data: { email: string; password: string }) {
  return axios.post(`${API_URL}/api/auth/signin`, data);
}

export async function googleSignIn() {
  return axios.get(`${API_URL}/api/auth/google`);
}

export async function googleCallback(params: Record<string, string>) {
  return axios.get(`${API_URL}/api/auth/google/callback`, { params });
}
