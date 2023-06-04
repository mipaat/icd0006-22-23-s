import type { EEntityType } from "./enums/EEntityType";
import type { EPlatform } from "./enums/EPlatform";

export interface IUrlSubmissionResult {
    queueItemId: string,
    type: EEntityType,
    entityId: string | null,
    platform: EPlatform,
    idOnPlatform: string,
    alreadyAdded: boolean,
}