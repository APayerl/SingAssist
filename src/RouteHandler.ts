import express, { Request, Response, Router } from "express";
import asyncHandler from 'express-async-handler';

import { AuthHandler } from "./AuthHandler";

export class RouteHandler {
    private nonAuthRoutes: string[];
    private myRoutes: Router;

    private authMiddle(req, res, next) {
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
        this.defineRoutes();
    }

    public get routes() {
        return this.myRoutes;
    }

    private defineRoutes() {
        this.myRoutes.route('/token').get((req: Request, res: Response) => {
            res.status(200).send("getted");
        });
    }

    // router.route('/test').get(checkToken, asyncHandler((req: Request, res: Response) => console.log('Tested!')));
}