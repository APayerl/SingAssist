export class AuthHandler {
    tokens: string[];

    constructor() {
        this.tokens = [];
    }
    public validToken(token: string): boolean {
        return this.tokens.includes(token);
    }
}