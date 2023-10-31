import { env } from '@/env';
import crypto, { createCipheriv } from 'node:crypto';

export function cryptingData(value: string){
    const key = crypto.scryptSync(env.CRYPTO_PASSWORD, 'salt', 24);

    const iv = Buffer.alloc(16, 0); // Initialization vector.

    const cipher = createCipheriv('aes-192-cbc', key, iv);

    let encrypted = cipher.update(value, 'utf8', 'hex');

    encrypted += cipher.final('hex');

    return encrypted;


}