import type { IRole } from "./IRole";

export interface IUserWithRoles {
    id: string,
    userName: string,
    isApproved: boolean,
    roles: IRole[],
}