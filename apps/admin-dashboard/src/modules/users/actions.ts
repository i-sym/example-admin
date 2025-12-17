'use server'

import 'server-only';
import { adminBackendOrpcClient } from '@/clients/admin-backend-client/orpc-client';

export async function listUsers() {
    return await adminBackendOrpcClient.users.list({});
}