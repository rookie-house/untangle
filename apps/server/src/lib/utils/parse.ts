import type { IResponseRunAgent } from "@/types/untangle-adk.types";

export const parseAdkResponse = (response: any) => {
    // Handle array response (direct events array)
    if (Array.isArray(response)) {
        const result = response[0]?.content?.parts[0]?.text || 'No Parse Result';
        return result;
    }

    // Handle object response with events property
    if (response?.events && Array.isArray(response.events)) {
        const result = response.events[0]?.content?.parts[0]?.text || 'No Parse Result';
        return result;
    }

    return 'No Parse Result';
}

// remove {} and  " from the data
export const removeSpecialCharacters = (text: string) => {
    return text.replace(/[{}]/g, '').replace(/"/g, '');
}