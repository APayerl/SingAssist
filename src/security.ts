import crypto from 'crypto';
import { CookieOptions } from 'express';
import { PreferenceParser } from './preference-parser';

export function hash(message: string): string {
    return crypto.createHash("sha256").update(message).digest("latin1");
}