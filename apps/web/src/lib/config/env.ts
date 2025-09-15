import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { defaultEmptyString } from "@/lib/validation/base.schema";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_PLATFORM_API_URL: defaultEmptyString,
  },
  runtimeEnv: {
    NEXT_PUBLIC_PLATFORM_API_URL: process.env.NEXT_PUBLIC_PLATFORM_API_URL,
  },
});
