import express, { Request, Response } from "express";
import expressForm from "express-formidable";
import asyncHandler from 'express-async-handler';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';

import { Authentication, checkToken } from './authentication';
import { PreferenceParser } from './preference-parser';

let prefParser = new PreferenceParser(require('../config/settings.json'));

// Router 
let router = express.Router();

//router.route('/test').get(checkToken, asyncHandler((req: Request, res: Response) => console.log('Tested!')));

// App
var app = express();

let keys = ['we sausage test piano girl gnome'];
const key = keys[0];
console.log('Key: ' + key);
app.get('/test', checkToken, (req, res) => console.log('test'));

let port: number;

let httpsAvail: boolean;
try {
    httpsAvail = prefParser.https.available
} catch(err) {
    httpsAvail = false;
    console.log(err);
}

port = prefParser.port;

app.use(expressForm());
app.use('/', router);

let server: https.Server | http.Server;

if(httpsAvail) {
    server = https.createServer({
        key: fs.readFileSync(prefParser.https.completePrivateKeyPath, { encoding: 'UTF-8', flag: 'r' }), 
        cert: fs.readFileSync(prefParser.https.completeCertPath, { encoding: 'UTF-8', flag: 'r' })
    }, app);
} else {
    server = http.createServer(app);
}

server.listen(port, prefParser.domain, () => {
    console.log(`Listening on ${prefParser.domain}:${port}!`);
});