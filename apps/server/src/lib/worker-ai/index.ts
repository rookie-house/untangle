import type { Context } from "hono";

export class WorkerAI {
    private static instance: WorkerAI;
    private constructor(private readonly ctx: Context) {
    }

    public static getInstance(ctx: Context): WorkerAI {
        if (!WorkerAI.instance) {
            WorkerAI.instance = new WorkerAI(ctx);
        }
        return WorkerAI.instance;
    }
    public static readonly run = async ({ ctx, input_text, max_length }: { ctx: Context; input_text: string; max_length: number }) => {
        const response = await ctx.env.AI.run("@cf/facebook/bart-large-cnn", {
            input_text,
            max_length,
        });
        return response.summary;
    };
}