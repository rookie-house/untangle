import axios, { Axios } from "axios";
import { Auth } from "./auth";
import { Document } from "./document";
import { Agent } from "./agent";
// import Cookies from "js-cookie";

class API {
  private readonly _axios: Axios;
  auth: Auth;
  document: Document;
  agent: Agent
  constructor() {
    this._axios = this.createAxios(import.meta.env.VITE_API_URL)
    this.auth = new Auth(this._axios);
    this.document = new Document(this._axios)
    this.agent = new Agent(this._axios)
  }

  private createAxios(url: string): Axios {
    const ax = axios.create({
      baseURL: url,
      withCredentials: true,
    });
    ax.interceptors.request.use(async (config) => {
      let accessToken: string | undefined = undefined;

      if (!accessToken && typeof window !== "undefined") {
        const result = await chrome.storage.local.get("access_token");
        accessToken = result["access_token"] ?? undefined;
      } 
      if (accessToken && accessToken.length > 0) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });
    return ax;
  }

  getAxios() {
    return this._axios;
  }
}

const api = new API();
export default api;




