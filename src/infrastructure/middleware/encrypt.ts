import { Request, Response, NextFunction } from 'express';
import { CompactEncrypt, importJWK } from 'jose';
import config from '@config/index';

// Example secret key for JWE (256-bit key)
const secret = Buffer.from(process.env.SECRET || config.security.secret, 'utf-8');

// Create a JWK from the secret
const key = importJWK({
    kty: 'oct',
    k: secret.toString('base64'),
    alg: 'A256GCMKW',
}, 'A256GCMKW');

export const encryptMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Preserve the original send method
    const originalSend = res.send.bind(res);

    // Override the send method
    res.send = async function (this: Response<any, Record<string, any>>, body: any) {
        if (body && typeof body === 'string') {
            try {
                console.log('Response: ', body);
                const jwe = await new CompactEncrypt(
                    new TextEncoder().encode(JSON.stringify(body))
                )
                    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
                    .encrypt(await key);

                // Ensure the return type matches Response
                return originalSend(jwe) as Response<any, Record<string, any>>;
            } catch (err) {
                return originalSend({ error: 'Encryption error' }) as Response<any, Record<string, any>>;
            }
        }
        return originalSend(body) as Response<any, Record<string, any>>;
    } as any; // Type assertion to any to bypass type checking

    next();
};
