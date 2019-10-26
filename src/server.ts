import express, { Request, Response } from "express";
import expressForm from "express-formidable";
import asyncHandler from 'express-async-handler';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import { sep } from 'path';
import * as Cookies from 'cookies';
import cookieParser from 'cookie-parser';
import cookieEncrypter from 'cookie-encrypter';
import crypto from 'crypto';

const settings = require('../config/settings.json');

import { Authentication, checkToken } from './authentication';
import { httpsAvailable } from './security';

// Router 
let router = express.Router();

router.route('/putCookie').get(asyncHandler((req: Request, res: Response) => Authentication.putCookie(req, res)));
router.route('/getCookie').get(asyncHandler((req: Request, res: Response) => Authentication.getCookie(req, res)));
//router.route('/test').get(checkToken, asyncHandler((req: Request, res: Response) => console.log('Tested!')));

// App
var app = express();
let keys = ['we sausage test piano girl gnome'];
// Shorten too long keys automatically?
const key = keys[0];
console.log('Key: ' + key);
// app.use(Cookies.express(keys));
app.use(cookieParser(key));
app.use(cookieEncrypter(key));
app.get('/test', checkToken, (req, res) => console.log('test'));

let port: number;

let httpsAvail: boolean;
try {
    httpsAvail = httpsAvailable(settings)
} catch(err) {
    httpsAvail = false;
    console.log(err);
}

port = <number> (httpsAvail ? (settings.https.port || 1443) : (process.env.PORT || 8085));

app.use(expressForm());
app.use('/', router);

let server: https.Server | http.Server;

if(httpsAvail) {
    let keyPath = settings.https.sslLocation + sep + settings.https.privKeyName;
    let certPath = settings.https.sslLocation + sep + settings.https.privKeyName;
    server = https.createServer({
        key: fs.readFileSync(keyPath, { encoding: 'UTF-8', flag: 'r' }), 
        cert: fs.readFileSync(certPath, { encoding: 'UTF-8', flag: 'r' })
    }, app);
} else {
    server = http.createServer(app);
}

server.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});