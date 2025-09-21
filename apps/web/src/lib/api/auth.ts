import { Axios } from "axios";
import { env } from "../config/env";

export class Auth {
	axios: Axios;

	constructor(axiosInstance: Axios) {
		this.axios = axiosInstance;
	}

	async signup(
		data: { name: string; email: string; password: string },
		sessionId?: string
	) {
		return this.axios.post(
			`${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/auth/signup`,
			data,
			{ params: { sessionId } }
		);
	}

	async signin(data: { email: string; password: string }, sessionId?: string) {
		return this.axios.post(
			`${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/auth/signin`,
			data,
			{ params: { sessionId } }
		);
	}

	async googleSignIn(sessionId?: string) {
		return this.axios.get(
			`${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/auth/google`,
			{ params: { sessionId } }
		);
	}

	async googleCallback(params: Record<string, string>) {
		return this.axios.get(
			`${env.NEXT_PUBLIC_PLATFORM_API_URL}/api/auth/google/callback`,
			{ params }
		);
	}
}
