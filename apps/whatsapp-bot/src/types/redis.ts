export interface SessionData {
	phoneNumber: string;
	sessionId: string;
}

export interface UserData {
	phoneNumber: string;
	token: string;
	sessionId?: string;
}
