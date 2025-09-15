import axios, { AxiosInstance } from "axios";

const axiosParam = {
  baseURL: process.env.GOOGLE_ADK_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
}

const axiosInstance = axios.create(axiosParam);

const api = (instance:AxiosInstance) => {
  return {
    get: (url: string, headers = {}) => instance.get(url, { headers }),
    post: (url: string, data: any, headers = {}) => instance.post(url, data, { headers }),
  }
}

export default api(axiosInstance);