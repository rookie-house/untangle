import { DevService } from "@/services/dev.service";
import type { Context } from "hono";

export class DevController {
	getStatus(ctx: Context) {
		const status = DevService.getStatus();
		return ctx.json({ status });
	}
}
