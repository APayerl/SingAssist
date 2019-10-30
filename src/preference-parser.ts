import * as fs from 'fs';
import { sep } from 'path';

export class PreferenceParser {
    private httpsObj: Https;
    private cookieObj: Cookie;

    constructor(private settings: any) {
        if(!this.settings) {
            throw new Error('No JSON found.');
        }
        this.httpsObj = new Https(this.settings);
        this.cookieObj = new Cookie(this.settings);
    }

    public get domain(): string {
        if(!this.settings.domain) throw new Error("Domain not specified in settings.");
        return this.settings.domain;
    }

    public get port(): number {
        if(!this.settings.port) throw new Error("Port not specified in settings.")
        return this.settings.port;
    }

    public get cookie(): Cookie {
        return this.cookieObj;
    }

    public get https(): Https {
        return this.httpsObj;
    }
}

class Https {
    constructor(private settings: any) {}

    public get available(): boolean {
        if(!this.settings.https) {
            return false;
        }
        if(!this.settings.https.sslLocation) {
            throw new Error('No key location specified.');
        }
        if(!this.settings.https.privKeyName) {
            throw new Error('No private key specified.');
        }
        if(!fs.existsSync(this.settings.https.sslLocation + sep + this.settings.https.privKeyName)) {
            console.log('Private key not found.');
            return false;
        }
        if(!this.settings.https.certName) {
            throw new Error('No server cert specified.');
        }
        if(!fs.existsSync(this.settings.https.sslLocation + sep + this.settings.https.certName)) {
            console.log('Cert not found.');
            return false;
        }
        return true;
    }

    public get completeCertPath(): string {
        if(!this.settings.https.sslLocation) throw new Error("sslLocation not specified for https in settings.");
        if(!this.settings.https.certName) throw new Error("certName not specified for https in settings.");
        return this.settings.https.sslLocation + sep + this.settings.https.certName;
    }

    public get completePrivateKeyPath(): string {
        if(!this.settings.https.sslLocation) throw new Error("sslLocation not specified for https in settings.");
        if(!this.settings.https.privKeyName) throw new Error("privKeyName not specified for https in settings.");
        return this.settings.https.sslLocation + sep + this.settings.https.privKeyName;
    }
}

class Cookie {
    constructor(private settings: any) {
        if(!this.settings.cookie) throw new Error("cookie not set in settings.");
    }

    public get httpOnly(): boolean {
        if(!this.settings.cookie.httpOnly) throw new Error("httpOnly is not set for cookie in settings.");
        return this.settings.cookie.httpOnly;
    }

    public get signed(): boolean {
        if(!this.settings.cookie.signed) throw new Error("signed is not set for cookie in settings.");
        return this.settings.cookie.signed;
    }

    public get sameSite(): string {
        if(!this.settings.cookie.sameSite) throw new Error("sameSite is not set for cookie in settings.");
        return this.settings.cookie.sameSite;
    }

    public get maxAge(): number {
        if(!this.settings.cookie.maxAge) throw new Error("maxAge is not set for cookie in settings.");
        return this.settings.cookie.maxAge;
    }

    public get domain(): string {
        if(this.settings.cookie.domain) {
            return this.settings.cookie.domain;
        } else {
            return this.settings.domain;
        }
    }
}