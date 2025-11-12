/**
 * ADK Response Parser
 * Converts ADK API responses to readable message format
 */

export interface ADKMessagePart {
  text?: string;
  functionCall?: {
    id: string;
    name: string;
    args?: Record<string, unknown>;
  };
  functionResponse?: {
    id: string;
    name: string;
    response?: unknown;
  };
  thoughtSignature?: string;
}

export interface ADKMessage {
  id: string;
  content: {
    parts: ADKMessagePart[];
    role: string;
  };
  finishReason: string;
  role: 'model' | 'user';
  timestamp: number;
  author?: string;
  invocationId?: string;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
  };
}

export interface ParsedMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  tokens?: {
    prompt: number;
    candidates: number;
  };
}

/**
 * Extract text content from ADK message parts
 */
function extractTextContent(parts: ADKMessagePart[]): string {
  return parts
    .map((part) => {
      if (part.text) return part.text;
      //   if (part.functionCall) {
      //     return `[Calling: ${part.functionCall.name}]`;
      //   }
      //   if (part.functionResponse) {
      //     return `[Response from: ${part.functionResponse.name}]`;
      //   }
      return '';
    })
    .filter(Boolean)
    .join('\n');
}

/**
 * Format timestamp to readable string
 */
function formatTimestamp(timestamp: number): string {
  try {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
}

/**
 * Parse ADK response array into structured messages
 * Ensures all responses have role: 'model'
 */
export function parseADKResponse(response: unknown): ParsedMessage[] {
  if (!Array.isArray(response)) {
    console.warn('[ADK Parser] Invalid response format - expected array');
    return [];
  }

  const parsed = response
    .map((item: ADKMessage, index: number): ParsedMessage | null => {
      try {
        // Extract the main text content
        const content = item.content?.parts || [];
        const textContent = extractTextContent(content);

        if (!textContent) {
          return null; // Skip empty messages
        }

        // Ensure role is set to 'model' (API responses should have this)
        const message: ParsedMessage = {
          id: item.id || `msg-${index}`,
          role: 'model',
          content: textContent,
          timestamp: formatTimestamp(item.timestamp),
          tokens: {
            prompt: item.usageMetadata?.promptTokenCount || 0,
            candidates: item.usageMetadata?.candidatesTokenCount || 0,
          },
        };

        return message;
      } catch (error) {
        console.warn('Error parsing ADK message:', error, item);
        return null;
      }
    })
    .filter(Boolean) as ParsedMessage[];
  return parsed;
}

/**
 * Format a single ADK message object
 */
export function parseADKMessage(message: ADKMessage): ParsedMessage | null {
  try {
    const content = message.content?.parts || [];
    const textContent = extractTextContent(content);

    if (!textContent) {
      return null;
    }

    return {
      id: message.id || crypto.randomUUID(),
      role: message.role === 'model' ? 'model' : 'user',
      content: textContent,
      timestamp: formatTimestamp(message.timestamp),
      tokens: {
        prompt: message.usageMetadata?.promptTokenCount || 0,
        candidates: message.usageMetadata?.candidatesTokenCount || 0,
      },
    };
  } catch (error) {
    console.warn('Error parsing ADK message:', error, message);
    return null;
  }
}

/**
 * Get summary of ADK response for display
 */
export function getADKSummary(response: unknown): {
  totalMessages: number;
  textMessages: number;
  totalTokens: number;
} {
  if (!Array.isArray(response)) {
    return { totalMessages: 0, textMessages: 0, totalTokens: 0 };
  }

  let textMessages = 0;
  let totalTokens = 0;

  response.forEach((item: ADKMessage) => {
    const content = item.content?.parts || [];
    const hasText = content.some((part: ADKMessagePart) => part.text);
    if (hasText) textMessages++;

    totalTokens +=
      (item.usageMetadata?.promptTokenCount || 0) + (item.usageMetadata?.candidatesTokenCount || 0);
  });

  return {
    totalMessages: response.length,
    textMessages,
    totalTokens,
  };
}
