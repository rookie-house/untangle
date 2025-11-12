import { z } from 'zod';
import { checkIfBigint } from '../utils/validation';

export const id = z.coerce.string().describe('Snowflake ID');

export const strictId = id.refine((val) => checkIfBigint(val.trim()), 'Not a valid ID');

export type ID = z.infer<typeof id>;

export const ResponseSchema = z.object({
  status: z.number(),
  success: z.boolean(),
  message: z.any(),
});

export const defaultEmptyString = z.string().trim().default('');

export const dateString = z.coerce.string().refine((val) => !isNaN(Date.parse(val)));

export const defaultDateString = dateString.default(
  new Date().toISOString().split('T')[0] ?? new Date().toISOString()
);

export const attachmentUrls = z
  .string()
  .default('')
  .transform((str) => str.split(',').filter((url) => url.length > 0));

export const baseEntitySchema = z.object({
  id,
  created_at: dateString,
  updated_at: dateString,
});

export type BaseEntity = z.infer<typeof baseEntitySchema>;

export type ExcludeBaseProps<
  T extends Record<string, unknown>,
  E extends keyof T = keyof BaseEntity,
> = Omit<T, keyof BaseEntity | E>;

export const excludeBaseProps = <T extends z.ZodObject<(typeof baseEntitySchema)['shape']>>(
  schema: T
) => {
  return schema.omit({
    id: true,
    created_at: true,
    updated_at: true,
  }) as unknown as StripBaseProps<T>;
};

export type StripBaseProps<
  T extends z.ZodObject<(typeof baseEntitySchema)['shape'] & z.ZodRawShape>,
> = Omit<T, 'shape'> & {
  shape: Omit<
    {
      [K in keyof T['shape']]: T['shape'][K];
    },
    keyof BaseEntity
  >;
};

// Common CRUD operation schemas
export const createEntitySchema = <T extends z.ZodTypeAny>(entitySchema: T) => entitySchema;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateEntitySchema = <T extends z.ZodObject<any>>(entitySchema: T) =>
  z
    .object({
      id: strictId,
    })
    .merge(entitySchema.partial());

export const deleteEntitySchema = z.object({
  id: strictId,
});

export const queryEntitySchema = z.object({
  id: strictId,
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1),
  fields: z.array(z.string()).optional(),
});

export type SearchParams = z.infer<typeof searchSchema>;
