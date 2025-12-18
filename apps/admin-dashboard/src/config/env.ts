import { z } from 'zod';

export const EnvSchema = z.object({
    // [Hint]: You can setup crawler to look for the token in next lines
    // begin_ENV
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
   BACKEND_URL: z.string().url(),
    // end_ENV
});

export const env = EnvSchema.parse(process.env);