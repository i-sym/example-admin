import { z } from 'zod';
import { config } from 'dotenv';
config();

export const EnvSchema = z.object({
    // [Hint]: You can setup crawler to look for the token in next lines
    // begin_ENV
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number(),
    HOST: z.string(),
    DATABASE_URL: z.string().url(),
    // end_ENV
});

export const env = EnvSchema.parse(process.env);