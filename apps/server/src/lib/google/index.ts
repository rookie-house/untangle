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

	/**
	 * Get the singleton instance of GoogleAuth
	 * @param googleClientId - Google Client ID
	 * @param googleClientSecret - Google Client Secret
	 * @param googleRedirectUri - Google Redirect URI
	 * @returns {GoogleAuth} - The singleton instance of GoogleAuth
	 */
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

	/**
	 * Generate Google OAuth2 authentication URL
	 * @param sessionId - Optional session ID to include in the state parameter
	 * @returns {string} - The generated authentication URL
	 */
	public getAuthUrl(sessionId?: string) {
		const authUrl = this._googleClient.generateAuthUrl({
			access_type: 'offline',
			scope: this._scopes,
			include_granted_scopes: true,
			state: sessionId ? `session:${sessionId}` : crypto.randomBytes(32).toString('hex'),
		});
		return authUrl;
	}

	/**
	 * Exchange authorization code for access tokens
	 * @param code - The authorization code received from Google
	 * @returns {Promise<OAuth2Client['credentials']>} - The access tokens
	 */
	public async getTokens(code: string) {
		const { tokens } = await this._googleClient.getToken(code);
		return tokens;
	}

	/**
	 * Retrieve user profile information using the access token
	 * @param accessToken - The access token obtained from Google
	 * @returns {Promise<{ email: string | undefined; name: string | undefined; profilePic: string | undefined }>} - The user's profile information
	 */
	public async me(accessToken: string) {
		this._googleClient.setCredentials({ access_token: accessToken });

		const people = google.people({ version: 'v1', auth: this._googleClient });
		const response = await people.people.get({
			resourceName: 'people/me',
			personFields: 'emailAddresses,names,photos',
		});

		const person = response.data;
		if (!person) {
			throw new Error('No user data returned from Google');
		}

		const email = person.emailAddresses?.[0]?.value;
		const name = person.names?.[0]?.displayName;
		const profilePic = person.photos?.[0]?.url;

		return {
			email,
			name,
			profilePic,
		};
	}
}

export default GoogleAuth;
