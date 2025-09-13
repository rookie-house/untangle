import { DevService } from "@/services/dev.service";
import type { Context } from "hono";

export class DevController {
	public static getStatus(ctx: Context) {
		const status = DevService.getStatus();
		return ctx.json({ status });
	}
}
