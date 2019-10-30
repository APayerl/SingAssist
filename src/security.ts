import crypto from 'crypto';
import { CookieOptions } from 'express';
import { PreferenceParser } from './preference-parser';

export function hash(message: string): string {
    return crypto.createHash("sha256").update(message).digest("latin1");
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