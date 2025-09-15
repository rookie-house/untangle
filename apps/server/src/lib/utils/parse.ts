import type { IResponseRunAgent } from "@/types/untangle-adk.types";

export const parseAdkResponse = (response: unknown) => {
    // Handle array response (direct events array)
    if (Array.isArray(response)) {
        // Type guard for array of objects with expected structure
        const first = response[0] as { content?: { parts?: { text?: string }[] } };
        const result = first?.content?.parts?.[0]?.text || 'No Parse Result';
        return result;
    }

    // Handle object response with events property
    if (
        typeof response === 'object' &&
        response !== null &&
        'events' in response &&
        Array.isArray((response as { events: unknown }).events)
    ) {
        const events = (response as { events: any[] }).events;
        const firstEvent = events[0] as { content?: { parts?: { text?: string }[] } };
        const result = firstEvent?.content?.parts?.[0]?.text || 'No Parse Result';
        return result;
    }

    return 'No Parse Result';
}

// remove {} and  " from the data
export const removeSpecialCharacters = (text: string) => {
    return text.replace(/[{}]/g, '').replace(/"/g, '');
}