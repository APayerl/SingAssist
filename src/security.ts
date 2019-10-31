import crypto from 'crypto';
import { CookieOptions } from 'express';
import { PreferenceParser } from './preference-parser';

export function hash256(message: string): string {
    return crypto.createHash("sha256").update(message).digest("hex");
}

export function hash_SHA3_512(message: string): string {
    return crypto.createHash("sha3-512").update(message).digest("hex");
}

export function getCookieOptions(prefParser: PreferenceParser): CookieOptions {
    let cookieOptions: CookieOptions = {
        domain: prefParser.domain,
        httpOnly: prefParser.cookie.httpOnly,
        secure: prefParser.https.available,
        signed: prefParser.cookie.signed,
        sameSite: prefParser.cookie.sameSite,
        maxAge: prefParser.cookie.maxAge
    };
    return cookieOptions;
}