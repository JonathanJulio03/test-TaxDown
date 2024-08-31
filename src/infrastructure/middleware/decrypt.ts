import { Request, Response, NextFunction } from 'express';
import { compactDecrypt, importJWK } from 'jose';
import config from '@config/index';

// Example secret key for JWE (256-bit key)
const secret = Buffer.from(process.env.SECRET || config.security.secret, 'utf-8');

// Create a JWK from the secret
const key = importJWK({
    kty: 'oct',
    k: secret.toString('base64'),
    alg: 'A256GCMKW',
}, 'A256GCMKW');

export const decryptMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body && req.body.jwe) {
        try {
            const { plaintext } = await compactDecrypt(req.body.jwe, await key);
            req.body = JSON.parse(plaintext.toString());
        } catch (err) {
            return res.status(400).json({ error: 'Invalid JWE' });
        }
    }
    next();
};
