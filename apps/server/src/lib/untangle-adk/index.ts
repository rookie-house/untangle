import axios, { type AxiosInstance } from 'axios';
import type {
	ICreateSessionParams,
	IDeleteSessionParams,
	IGetSessionParams,
	IListSessionsParams,
	IResponseCreateSession,
	IResponseListApps,
	IResponseListSessions,
	IResponseRunAgent,
	IRunAgentParams,
} from '@/types/untangle-adk.types';

export class UntangleADK {
	private static instance: UntangleADK;
	private axiosInstance: AxiosInstance;
	private _app_name = 'untangle-adk';
	private constructor(
		private config: {
			api: string;
		},
	) {
		this.axiosInstance = axios.create({
			baseURL: this.config.api,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			withCredentials: true,
		});
	}

	public static getInstance({ api }: { api: string }): UntangleADK {
		if (!UntangleADK.instance) {
			UntangleADK.instance = new UntangleADK({ api });
		}
		return UntangleADK.instance;
	}

	public async getAgents(): Promise<IResponseListApps> {
		const { data } = await this.axiosInstance.get('/list-apps');
		return data;
	}

	public async getSession(params: IGetSessionParams): Promise<IResponseCreateSession> {
		const { userId, sessionId } = params;
		const { data } = await this.axiosInstance.get(`apps/${this._app_name}/users/${userId.toString()}/sessions/${sessionId}`);
		return data;
	}

	public async createSession(params: ICreateSessionParams): Promise<IResponseCreateSession> {
		const { userId, sessionId } = params;
		const { data } = await this.axiosInstance.post(`apps/${this._app_name}/users/${userId.toString()}/sessions/${sessionId}`, {
			userId,
		});
		return data;
	}

	public async listSessions(params: IListSessionsParams): Promise<IResponseListSessions> {
		const { userId } = params;
		const { data } = await this.axiosInstance.get(`/apps/${this._app_name}/users/${userId.toString()}/sessions`);
		return {
			sessions: data,
		};
	}

	public async runAgent(params: IRunAgentParams): Promise<IResponseRunAgent> {
		const { userId, sessionId, message, role, streaming, stateDelta, rawFiles } = params;
		const parts =
			rawFiles && rawFiles.length > 0
				? [
						{ text: message },
						...rawFiles.map((file) => ({
							fileData: {
								displayName: file.displayName,
								fileUri: file.fileUri,
								mimeType: file.mimeType,
							},
						})),
					]
				: [{ text: message }];

		try {
			const { data } = await this.axiosInstance.post('/run', {
				appName: this._app_name,
				userId: userId.toString(),
				sessionId: sessionId,
				newMessage: {
					parts: parts,
					role: role || 'user',
				},
				streaming: true,
				stateDelta: stateDelta || {},
			});
			if (!data) {
				throw new Error('No response data from UntangleADK');
			}
			return data;
		} catch (error) {
			console.error('Error in UntangleADK.runAgent:', error);
			throw new Error(`Failed to run agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	public async deleteSession(params: IDeleteSessionParams): Promise<null> {
		const { userId, sessionId } = params;
		const { data } = await this.axiosInstance.delete(`/apps/${this._app_name}/users/${userId.toString()}/sessions/${sessionId.toString()}`);
		return data;
	}
}
