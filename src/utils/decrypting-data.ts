import { env } from "@/env";
import crypto from 'node:crypto';

export function decryptingData(value: string){
    const key = crypto.scryptSync(env.CRYPTO_PASSWORD, 'salt', 24);

    const iv = Buffer.alloc(16, 0); // Initialization vector.

    const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);

    let decrypted = decipher.update(value, 'hex', 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted;
}