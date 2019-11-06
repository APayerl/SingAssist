import jwt from 'jsonwebtoken';
import { options } from 'joi';
import { PreferenceParser } from './preference-parser';
import express, { Request, Response } from "express";
import { request } from 'https';

export let authRouter = express.Router();

authRouter.route('/token').get((req: Request, res: Response) => {
    res.status(200).send("getted");
});