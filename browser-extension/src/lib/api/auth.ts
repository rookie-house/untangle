import { Axios } from "axios";

const API_URL =  'http://localhost:8787';

export class Auth {

	constructor(private readonly api: Axios) {}

	async ping() {
		const {data} =await this.api.get(`${API_URL}/api/auth/me`);
        return data;
	}
}
