import { NavigateFunction } from "react-router-dom";
import { IAuthenticationContext } from "../contexts/IAuthenticationContext";
import { IUrlSubmissionData } from "../dto/IUrlSubmissionData";
import { IUrlSubmissionResult } from "../dto/IUrlSubmissionResult";
import { BaseAuthenticatedService } from "./BaseAuthenticatedService";

export class UrlSubmissionService extends BaseAuthenticatedService {
    constructor(authContext: IAuthenticationContext, navigate: NavigateFunction, getLocation: () => Location) {
        super("v1/LinkSubmit/", authContext, navigate, getLocation);
    }

    public async submit(data: IUrlSubmissionData): Promise<IUrlSubmissionResult> {
        const result = await this.post<IUrlSubmissionResult>("submit", data);
        return result.data;
    }
}