import axios, { Axios } from "axios";
// import Cookies from "js-cookie";

class API {
  private readonly _axios: Axios;
  // auth: Auth;

  constructor() {
    this._axios = this.createAxios(import.meta.env.VITE_API_URL)
    // this.auth = new Auth(this._axios);
  }

  private createAxios(url: string): Axios {
    const ax = axios.create({
      baseURL: url,
      withCredentials: true,
    });
  
    return ax;
  }

  getAxios() {
    return this._axios;
  }
}

const api = new API();
export default api;