import jwt_decode from "jwt-decode";

export class DecodedJWT {
    public token: string;
    public expiresAt: Date;
    public name: string;

    constructor(token: string) {
        this.token = token;
        const jwtObject: any = jwt_decode(token);
        this.name = jwtObject['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
        this.expiresAt = new Date(parseInt(jwtObject['exp']) * 1000);
    }
}
