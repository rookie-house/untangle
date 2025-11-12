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

// Helper: normalize inlineData so remote receives plain base64 + mime/encoding
const normalizeInlineDataMessage = (message: any) => {
	// Clone to avoid mutating original
	const newMessage = { ...message };
	if (!Array.isArray(newMessage.parts)) return newMessage;

	newMessage.parts = newMessage.parts.map((part: any) => {
		if (part && part.inlineData && typeof part.inlineData.data === 'string') {
			// Check if data is in data URL format (data:mime/type;base64,...)
			const match = part.inlineData.data.match(/^data:(.+);base64,(.*)$/s);
			if (match) {
				const [, mimeType, base64] = match;
				return {
					...part,
					inlineData: {
						displayName: part.inlineData.displayName,
						// Send only the raw base64 payload (no "data:...;base64," prefix)
						data: base64,
						mimeType: mimeType || part.inlineData.mimeType,
					},
				};
			}
		}
		return part;
	});

	return newMessage;
};

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
		const { data } = await this.axiosInstance.get(`/apps/${this._app_name}/users/${userId.toString()}/sessions/${sessionId}`);
		return data;
	}

	public async createSession(params: ICreateSessionParams): Promise<IResponseCreateSession> {
		const { userId, sessionId } = params;
		const { data } = await this.axiosInstance.post(`/apps/${this._app_name}/users/${userId.toString()}/sessions/${sessionId}`, {
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
				streaming: streaming || false,
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

	public async runAgentInlineData(params: IRunAgentParams): Promise<IResponseRunAgent> {
		const { userId, sessionId, message, role, streaming, stateDelta, inlineFiles } = params;
		const parts =
			inlineFiles && inlineFiles.length > 0
				? [
						{ text: message },
						...inlineFiles.map((file) => ({
							inlineData: {
								displayName: file.displayName,
								data: file.data,
								mimeType: file.mimeType,
							},
						})),
					]
				: [{ text: message }];

		try {
			// Normalize the message to strip data URL prefix from base64 data
			const normalizedMessage = normalizeInlineDataMessage({
				parts: parts,
				role: role || 'user',
			});

			const { data } = await this.axiosInstance.post('/run', {
				appName: this._app_name,
				userId: userId.toString(),
				sessionId: sessionId,
				newMessage: normalizedMessage,
				streaming: streaming || false,
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
