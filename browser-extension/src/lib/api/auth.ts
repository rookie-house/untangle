import { Axios } from "axios";

export class Auth {
  constructor(private readonly api: Axios) {}

  async ping() {
    const { data } = await this.api.get(`/api/auth/me`);
    return data;
  }
}
