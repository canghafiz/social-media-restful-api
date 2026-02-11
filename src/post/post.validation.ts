import { z, ZodType } from 'zod';

export class PostValidation {
  static readonly ADD: ZodType = z.object({
    post_text: z.string().min(1),
    visibility: z.string().min(1),
  });
  static readonly UPDATE: ZodType = z.object({
    post_text: z.string().min(1),
    visibility: z.string().min(1),
  });
}
