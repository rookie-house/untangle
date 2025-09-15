import type { Context } from "hono";

export class WorkerAI {
    private static instance: WorkerAI;
    constructor(private readonly ctx: Context) {
        if (WorkerAI.instance) {
            return WorkerAI.instance;
        }
        WorkerAI.instance = this;
        this.ctx = ctx;
    }
    public static readonly run = async ({ ctx, input_text, max_length }: { ctx: Context; input_text: string; max_length: number }) => {
        const response = await ctx.env.AI.run("@cf/facebook/bart-large-cnn", {
            input_text,
            max_length,
        });
        return response.summary;
    };
}