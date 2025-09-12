import { Hono } from "hono";
import type { Env, Val } from "@/types/bindings";

export const hono = () => new Hono<{ Bindings: Env; Variables: Val }>();
