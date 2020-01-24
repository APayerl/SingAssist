import express, { Request, Response } from "express";
import expressForm from "express-formidable";
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';

import { PreferenceParser } from './preference-parser';
import { RouteHandler } from "./RouteHandler";
import { AuthHandler } from "./AuthHandler";
import { DbHandler } from "./DbHandler";
import { users } from "./User";

let prefParser = new PreferenceParser(require('../config/settings.json'));

let db = new DbHandler(prefParser);

// App
var app = express();

let httpsAvail: boolean;
try {
    httpsAvail = prefParser.https.available
} catch(err) {
    httpsAvail = false;
    console.log(err);
}

let routeHandler = new RouteHandler(new AuthHandler());

app.use(expressForm());
app.use('/users', users);
// app.use('/', routeHandler.routes);

let server: https.Server | http.Server;

if(httpsAvail) {
    server = https.createServer({
        key: fs.readFileSync(prefParser.https.completePrivateKeyPath, { encoding: 'UTF-8', flag: 'r' }), 
        cert: fs.readFileSync(prefParser.https.completeCertPath, { encoding: 'UTF-8', flag: 'r' })
    }, app);
} else {
    server = http.createServer(app);
}

server.listen(prefParser.port, prefParser.domain, () => {
    console.log(`Listening on ${prefParser.domain}:${prefParser.port}!`);
});