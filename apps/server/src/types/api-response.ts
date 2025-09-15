interface Response {
	success: boolean;
	message: unknown;
	data?: unknown | null;
}

/**
 * Format the response to be sent back to the client
 * @param message Message to be sent back
 * @param data Data to be sent back
 * @param is_error If the response is an error
 * @returns Formatted response
 */
export const api_response = ({
	message,
	data,
	is_error = false,
}: {
	message: unknown;
	data?: unknown | null;
	is_error?: boolean;
}) => {
	const response: Response = {
		success: !is_error,
		data: data || null,
		message,
	};


	return response;
};
