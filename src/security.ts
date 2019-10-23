import * as fs from 'fs';
import { sep } from 'path';

export function httpsAvailable(settings: any): boolean {
    if(!settings) {
        throw new Error('No JSON found.');
    }
    if(!settings.https) {
        return false;
    }
    if(!settings.https.port) {
        throw new Error('No HTTPS port specified.');
    }
    if(!settings.https.sslLocation) {
        throw new Error('No key location specified.');
    }
    if(!settings.https.privKeyName) {
        throw new Error('No private key specified.')
    }
    if(!fs.existsSync(settings.https.sslLocation + sep + settings.https.privKeyName)) {
        console.log('Private key not found.')
        return false;
    }
    if(!settings.https.certName) {
        throw new Error('No server cert specified.')
    }
    if(!fs.existsSync(settings.https.sslLocation + sep + settings.https.certName)) {
        console.log('Cert not found.')
        return false;
    }
    return true;
}