export class DevService {
	public static readonly getStatus = () => {
		return {
			uptime: process.uptime(),
			uptimeFormatted: new Date(process.uptime() * 1000)
				.toISOString()
				.substr(11, 8),
		};
	};
}
