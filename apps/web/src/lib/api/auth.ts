import { Axios } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

export class Auth {
	axios: Axios;

	constructor(axiosInstance: Axios) {
		this.axios = axiosInstance;
	}

	async signup(data: { name: string; email: string; password: string }) {
		return this.axios.post(`${API_URL}/api/auth/signup`, data);
	}

	async signin(data: { email: string; password: string }) {
		return this.axios.post(`${API_URL}/api/auth/signin`, data);
	}

	async googleSignIn() {
		return this.axios.get(`${API_URL}/api/auth/google`);
	}

	async googleCallback(params: Record<string, string>) {
		return this.axios.get(`${API_URL}/api/auth/google/callback`, { params });
	}
}
