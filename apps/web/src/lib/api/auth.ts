import { Axios } from "axios";
import { env } from "../config/env";


export class Auth {
	axios: Axios;

	constructor(axiosInstance: Axios) {
		this.axios = axiosInstance;
	}

	async signup(data: { name: string; email: string; password: string }) {
		return this.axios.post(`${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/auth/signup`, data);
	}

	async signin(data: { email: string; password: string }) {
		return this.axios.post(`${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/auth/signin`, data);
	}

	async googleSignIn() {
		return this.axios.get(`${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/auth/google`);
	}

	async googleCallback(params: Record<string, string>) {
		return this.axios.get(`${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/auth/google/callback`, { params });
	}
}
