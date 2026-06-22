import { Axios } from "axios";

export interface StartSessionImage {
  name: string;
  type: "image" | "pdf" | "other";
  size?: number;
  data: string;
}

export interface StartSessionRequest {
  message: string;
  sessionId?: string;
  documentId?: string;
  img?: StartSessionImage[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface DemistifySessionData {
  explanation?: string;
  confidence?: number;
  highlights?: string[];
  text?: string;
}

export class Agent {
  constructor(private readonly api: Axios) {}

  async startSession<T = DemistifySessionData>(input: StartSessionRequest): Promise<ApiResponse<T>> {
    const { data } = await this.api.post<ApiResponse<T>>("/api/agents/sessions", input);
    return data;
  }

  async startChat(input: StartSessionRequest): Promise<ApiResponse<DemistifySessionData>> {
    return this.startSession<DemistifySessionData>(input);
  }
}
