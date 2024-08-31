import { BaseError } from "@error/base-error";
import { Request, Response } from "express";
import config from '@config/index';
import { compactDecrypt, CompactEncrypt, importJWK } from "jose";

// Example secret key for JWE (256-bit key)
const secret = Buffer.from(process.env.SECRET || config.security.secret, 'utf-8');

// Create a JWK from the secret
const key = importJWK({
    kty: 'oct',
    k: secret.toString('base64'),
    alg: 'A256GCMKW',
}, 'A256GCMKW');

export class JweController {

    static async decode(req: Request, res: Response) {
        try {
            const { plaintext } = await compactDecrypt(req.params.jwe, await key);
            console.log(JSON.parse(plaintext.toString()));
            return res.status(200).json(JSON.parse(plaintext.toString()));
        } catch (error) {
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
        }
    }

    static async encode(req: Request, res: Response) {
        try {
            const jwe = await new CompactEncrypt(
                new TextEncoder().encode(JSON.stringify(req.params.jwe))
            )
                .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
                .encrypt(await key);
            console.log(jwe);
            return res.status(200).json(jwe);
        } catch (error) {
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
        }
    }
}