import * as fs from 'fs';
import { sep } from 'path';
import { EmptyResultError } from 'sequelize/types';

export class PreferenceParser {
    private httpsObj: Https;
    private myOrg: Organisation;
    private db: DatabaseSettings;

    constructor(private settings: any) {
        if(!this.settings) throw new Error('No JSON found.');
        if(!this.settings.organisation) throw new Error('No organisation specified in config');
        if(!this.settings.db) throw new Error('No database settings specified in config');
        this.httpsObj = new Https(this.settings);
        this.myOrg = new Organisation(this.settings.organisation);
        this.db = new DatabaseSettings(this.settings);
    }

    public get domain(): string {
        if(!this.settings.domain) throw new Error("Domain not specified in settings.");
        return this.settings.domain;
    }

    public get port(): number {
        if(!this.settings.port) throw new Error("Port not specified in settings.")
        return this.settings.port;
    }

    public get https(): Https {
        return this.httpsObj;
    }

    public get organisation(): Organisation {
        return this.myOrg;
    }

    public get database(): DatabaseSettings {
        return this.db;
    }
}

class Organisation {
    constructor(private org: any) {
        if(!org.name) throw new Error('No organisation name in config.');
    }
    public get name(): string {
        return this.org.name;
    }
}

class DatabaseSettings {
    constructor(private settings: any) {
        if(!this.settings.db.domain) throw new Error('No domain for the db specified.');
        if(!this.settings.db.port) throw new Error('No port for the db specified.');
    }

    public get name(): string {
        return this.settings.organisation.name.toLowerCase() + '_db';
    }

    public get sync_inteval(): number {
        return this.settings.db.sync_interval ? this.settings.db.sync_interval : 600000;
    }

    public get username(): string {
        if(!(this.settings.db.username || process.env.db_username)) throw new Error('No database username supplied in either config or environment.');
        return this.settings.db.username || process.env.db_username;
    }

    public get password(): string {
        if(!(this.settings.db.password || process.env.db_password)) throw new Error('No database password supplied in either config or environment.');
        return this.settings.db.password || process.env.db_password;
    }

    public get domain(): string {
        return this.settings.db.domain;
    }

    public get port(): number {
        return this.settings.db.port;
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