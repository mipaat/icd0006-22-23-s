import type { EEntityType } from "./EEntityType";
import type { EPlatform } from "./EPlatform";

export interface IUrlSubmissionResult {
    queueItemId: string,
    type: EEntityType,
    entityId: string | null,
    platform: EPlatform,
    idOnPlatform: string,
    alreadyAdded: boolean,
}