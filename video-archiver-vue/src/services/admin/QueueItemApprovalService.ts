import type { IQueueItemForApproval } from "@/dto/IQueueItemForApproval";
import { BaseAuthenticatedService } from "../BaseAuthenticatedService";
import type { IdentityService } from "../IdentityService";

export class QueueItemApprovalService extends BaseAuthenticatedService {
    constructor(identityService: IdentityService | null = null) {
        super("v1/admin/ApproveQueueItem/", identityService);
    }

    public async listAll(): Promise<IQueueItemForApproval[]> {
        const result = await this.get<IQueueItemForApproval[]>("ListAll");
        for (const queueItem of result.data) {
            queueItem.addedAt = new Date(queueItem.addedAt);
        }
        return result.data;
    }

    public async deleteQueueItem(id: string): Promise<void> {
        await this.delete(`DeleteQueueItem?id=${id}`);
    }

    public async approveQueueItem(id: string, grantAccess: boolean): Promise<void> {
        await this.post("ApproveQueueItem", { id: id, grantAccess: grantAccess });
    }
}