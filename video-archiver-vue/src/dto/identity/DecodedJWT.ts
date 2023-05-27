import jwt_decode from "jwt-decode";

export class DecodedJWT {
    public token: string;
    public expiresAt: Date;
    public name: string;
    public isAdmin: boolean;
    public isSuperAdmin: boolean;

    constructor(token: string) {
        this.token = token;
        const jwtObject: any = jwt_decode(token);
        this.name = jwtObject['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
        this.expiresAt = new Date(parseInt(jwtObject['exp']) * 1000);
        const roles: string = jwtObject['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        this.isAdmin = (roles !== null && roles !== undefined) ? roles.includes('Admin') || roles.includes('SuperAdmin') : false;
        this.isSuperAdmin = (roles !== null && roles !== undefined) ? roles.includes('SuperAdmin') : false;
    }
}
