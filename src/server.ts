import express from "express";
import { Request, Response } from "express";
import * as expressForm from "express-formidable";
import * as asyncHandler from 'express-async-handler';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as settings from '../config/settings.json';

console.log(settings.https);
// Modules
// router.route('/').get((req, res) => myFunction(req, res));
// router.route('/').post(asyncHandler((req: Request, res: Response) => myAsyncFunction(req, res)));

// App
var app = express();
var port = process.env.PORT || settings.https.port || 9090;

// Router 
var router = express.Router();

// app.use(expressForm());
app.use('/', router);

// let privateKey  = fs.readFileSync(settings.https.sslLocation + '/' + settings.https.privKeyName, 'utf8');
// let certificate = fs.readFileSync(settings.https.sslLocation + '/' + settings.https.pubKeyName, 'utf8');

let httpsOptions: https.ServerOptions | http.ServerOptions = {};
let server: https.Server | http.Server;

if(settings.https && 
    settings.https.sslLocation && 
    settings.https.privKeyName && 
    settings.https.pubKeyName) {
    server = https.createServer(app);
} else {
    server = http.createServer(app);
}

server.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});