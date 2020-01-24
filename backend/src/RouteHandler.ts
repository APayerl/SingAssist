import express, { Request, Response, Router } from "express";

import { AuthHandler } from "./AuthHandler";
import { users } from './User';

export class RouteHandler {
    private nonAuthRoutes: string[];
    private myRoutes: Router;

    private authMiddle(req: Request, res, next) {
        try {
            if(this.nonAuthRoutes.includes(req.path) || this.authHandler.validToken(req.query.token)) {
                next();
            }
            else {
                res.status(400).send("Token missing or invalid");
                return;
            }
        } catch(error) {
            console.log(error);
            res.status(400).send("Token missing");
            return;
        }
    }

    constructor(private authHandler: AuthHandler) {
        this.nonAuthRoutes = [];
        this.myRoutes = express.Router();
        this.myRoutes.use(this.authMiddle);
        this.myRoutes.use(users);// users
    }

    public get routes() {
        return this.myRoutes;
    }
}