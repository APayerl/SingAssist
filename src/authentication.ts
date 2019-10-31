import { Request, Response, NextFunction, CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import { options } from 'joi';
import { PreferenceParser } from './preference-parser';

export class Authentication {
}

export function checkToken(req, res, next) {
    let secret = process.env.JWTSECRET || 'we sausage test piano harp gnome game optimal strange herpies';
    console.log(req.headers['x-access-token'])
    console.log(req.headers['authorization'])
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                res.locals.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
}