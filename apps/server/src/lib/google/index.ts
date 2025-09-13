import { google, Auth } from 'googleapis';
import crypto from 'node:crypto';

class GoogleAuth {
	private static instance: GoogleAuth;
	private _googleClient: Auth.OAuth2Client;
	private _scopes = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];

	private constructor(
		private config: {
			googleClientId: string;
			googleClientSecret: string;
			googleRedirectUri: string;
		},
	) {
		this._googleClient = new google.auth.OAuth2(this.config.googleClientId, this.config.googleClientSecret, this.config.googleRedirectUri);
	}

	public static getInstance({
		googleClientId,
		googleClientSecret,
		googleRedirectUri,
	}: {
		googleClientId: string;
		googleClientSecret: string;
		googleRedirectUri: string;
	}): GoogleAuth {
		if (!GoogleAuth.instance) {
			GoogleAuth.instance = new GoogleAuth({
				googleClientId,
				googleClientSecret,
				googleRedirectUri,
			});
		}
		return GoogleAuth.instance;
	}

	public getAuthUrl() {
		const authUrl = this._googleClient.generateAuthUrl({
			access_type: 'offline',
			scope: this._scopes,
			include_granted_scopes: true,
			state: crypto.randomBytes(32).toString('hex'),
		});
		return authUrl;
	}

	public async getTokens(code: string) {
		const { tokens } = await this._googleClient.getToken(code);
		return tokens;
	}

	public async me(accessToken: string) {
		return await this._googleClient.getTokenInfo(accessToken);
	}
}

export default GoogleAuth;
