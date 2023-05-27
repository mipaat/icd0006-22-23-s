import type { EEntityType } from "./enums/EEntityType";
import type { EPlatform } from "./enums/EPlatform";
import type { IUser } from "./identity/IUser";

export interface IQueueItemForApproval {
    id: string,
    platform: EPlatform,
    idOnPlatform: string,
    entityType: EEntityType,
    addedBy: IUser,
    addedAt: Date,
    grantAccess: boolean,
}