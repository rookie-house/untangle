import axios, { Axios } from "axios";
import { Auth } from "./auth";
// import Cookies from "js-cookie";
import { env } from "../config/env";

class API {
  private readonly _axios: Axios;
  auth: Auth;

  constructor() {
    this._axios = this.createAxios(env.NEXT_PUBLIC_PLATFORM_API_URL);
    this.auth = new Auth(this._axios);
  }

  private createAxios(url: string): Axios {
    const ax = axios.create({
      baseURL: url,
      withCredentials: true,
    });
    // ax.interceptors.request.use(async (config) => {
    //   //Setting up authorization header
    //   let accessToken = Cookies.get("access_token");

    //   // For localhost development, fallback to localStorage if cookies don't work
    //   if (!accessToken && typeof window !== "undefined") {
    //     accessToken = localStorage.getItem("access_token") ?? undefined;
    //   } else {
    //   }

    //   // Set Authorization header if we have a token
    //   if (accessToken && accessToken.length > 0) {
    //     config.headers.Authorization = `Bearer ${accessToken}`;
    //   }

    //   // Also try setting cookies manually for platform API
    //   const refreshToken =
    //     Cookies.get("refresh_token") ?? localStorage.getItem("refresh_token");
    //   if (accessToken && refreshToken) {
    //     // Set as cookie string for cross-domain issues
    //     // eslint-disable-next-line dot-notation
    //     config.headers["Cookie"] =
    //       `access_token=${accessToken}; refresh_token=${refreshToken}`;
    //   }

    //   return config;
    // });
    return ax;
  }

  getAxios() {
    return this._axios;
  }
}

const api = new API();
export default api;