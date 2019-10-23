import express, { Request, Response } from "express";
import expressForm from "express-formidable";
import asyncHandler from 'express-async-handler';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
const settings = require('../config/settings.json');
import { Authentication } from './authentication';
import { httpsAvailable } from './security';

// Router 
let router = express.Router();

router.route('/').get(asyncHandler((req: Request, res: Response) => Authentication.login(req, res)));

// App
var app = express();
let port: number;

let httpsAvail: boolean;
try {
    httpsAvail = httpsAvailable(settings)
} catch(err) {
    httpsAvail = false;
    console.log(err);
}

port = <number> (httpsAvail ? (settings.https.port || 1443) : (process.env.PORT || 8080));

app.use(expressForm());
app.use('/', router);

let server: https.Server | http.Server;

if(httpsAvail) {
    let keyPath = settings.https.sslLocation + '/' + settings.https.privKeyName;
    let certPath = settings.https.sslLocation + '/' + settings.https.privKeyName;
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