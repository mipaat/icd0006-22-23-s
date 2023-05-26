import type { IUrlSubmissionResult } from "@/dto/IUrlSubmissionResult";
import { BaseAuthenticatedService } from "./BaseAuthenticatedService";
import { IdentityService } from "./IdentityService";
import type { IUrlSubmissionData } from "@/dto/IUrlSubmissionData";

export class UrlSubmissionService extends BaseAuthenticatedService {
    constructor(identityService: IdentityService | null = null) {
        super("v1/LinkSubmit/", identityService);
    }

    public async submit(data: IUrlSubmissionData): Promise<IUrlSubmissionResult> {
        const result = await this.post<IUrlSubmissionResult>("submit", data);
        return result.data;
    }
}