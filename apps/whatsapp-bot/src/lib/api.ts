import axios from "axios";

export async function getADKSession(token: string): Promise<any> {
    try {
        const { data } = await axios.get('https://untangled-api.rookie.house/api/agents/session', {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if (!data) {
            throw new Error('No response data from getADKSession');
        }
        return data;
    } catch (error: any) {
        console.error('Error in getADKSession:', error);
        throw new Error(`Failed to get ADK session: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
}

export async function uploadDocument(file: File, token: string): Promise<any> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await axios.put('https://untangled-api.rookie.house/api/documents/upload', formData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!data) {
            throw new Error('No response data from uploadDocument');
        }
        return data;
    } catch (error: any) {
        console.error('Error in uploadDocument:', error);
        throw new Error(`Failed to upload document: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
}

export async function chatWithADKSession(payload: ChatSessionPayload, token: string): Promise<any> {
    if (!payload.message || payload.message.length < 2) {
        throw new Error('Message must be at least 2 characters long.');
    }
    try {
        const { data } = await axios.post('https://untangled-api.rookie.house/api/agents/session', payload, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        if (!data) {
            throw new Error('No response data from chatWithADKSession');
        }
        return data;
    } catch (error: any) {
        console.error('Error in chatWithADKSession:', error);
        throw new Error(`Failed to chat with ADK session: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
}


export interface ChatImage {
    key: string;
    title: string;
    url: string;
    type: "pdf" | "image" | "other";
}

export interface ChatSessionPayload {
    message: string;
    sessionId?: string;
    img?: ChatImage[];
}

export function createChatSessionPayload(
    message: string,
    sessionId?: string,
    img?: ChatImage[]
): ChatSessionPayload {
    return {
        message,
        ...(sessionId && { sessionId }),
        ...(img && { img }),
    };
}
// }