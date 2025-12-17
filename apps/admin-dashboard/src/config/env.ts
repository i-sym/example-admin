import { z } from 'zod';

export const EnvSchema = z.object({
    // [Hint]: You can setup crawler to look for the token in next lines
    // begin ENVS
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
   BACKEND_URL: z.string().url(),
    // end ENVS
});

export const env = EnvSchema.parse(process.env);