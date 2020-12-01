import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export class AuthHandler {
    tokens: Map<String, Date>;
    users: string[]

    constructor() {
        this.tokens = new Map<string, Date>();
        this.users = [];
    }
    
    public validToken(token: string): boolean {
        if(this.tokens.has(token)) {
            return this.tokens.get(token).valueOf() < Date.now() ? true : false;
        } else {
            return false;
        }
    }

    public getToken(username: string, password: string): string {
        if(this.users.includes(crypto.createHash("sha3-512").update(username + password).digest("hex"))) {
            let secret = "my super secret";
            let myHash = crypto.createHash("sha3-512").update(username + password).digest("hex");
            let token = jwt.sign(myHash, secret, { algorithm: "HS512", encoding: "UTF-8", expiresIn: 60*5 });

        }
        return null;
    }
}
