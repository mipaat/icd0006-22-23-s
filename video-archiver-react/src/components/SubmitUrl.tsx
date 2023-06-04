import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../routes/Root";
import { IUrlSubmissionData } from "../dto/IUrlSubmissionData";
import { UrlSubmissionService } from "../services/UrlSubmissionService";
import { isIRestApiErrorResponse } from "../dto/IRestApiErrorResponse";
import { ERestApiErrorType } from "../dto/enums/ERestApiErrorType";
import { IUrlSubmissionResult } from "../dto/IUrlSubmissionResult";
import { handleChangeEvent } from "../utils/Utils";

const SubmitUrl = () => {
    const authContext = useContext(AuthContext);
    const [submitting, setSubmitting] = useState(false);
    const [urlSubmissionData, setUrlSubmissionData] = useState({
        link: "",
        submitPlaylist: false,
    } as IUrlSubmissionData);
    const [displayError, setDisplayError] = useState(null as string | null);
    const urlSubmissionService = new UrlSubmissionService(authContext);
    const [urlSubmissionResult, setUrlSubmissionResult] = useState(null as IUrlSubmissionResult | null);

    const onSubmit = async (event: MouseEvent | Event | FormEvent) => {
        event.preventDefault();
        setDisplayError(null);
        try {
            setSubmitting(true);
            const result = await urlSubmissionService.submit(urlSubmissionData);
            setSubmitting(false);
            setUrlSubmissionResult(result);
        } catch (e) {
            setSubmitting(false);
            if (isIRestApiErrorResponse(e)) {
                if (e.errorType === ERestApiErrorType.UnrecognizedUrl) {
                    setDisplayError("Unrecognized/invalid URL");
                } else {
                    setDisplayError(e.error);
                }
            } else {
                setDisplayError("Unknown error occurred");
            }
        }
    }

    const reset = () => {
        setUrlSubmissionResult(null);
        setSubmitting(false);
        setUrlSubmissionData(previous => {
            return { ...previous, link: "" };
        });
    }

    if (authContext.jwt && authContext.jwt.isAllowedToSubmitEntity) {
        if (submitting) return <div className="text-center">
            Please wait, submitting URL {urlSubmissionData.link}
        </div>

        if (urlSubmissionResult) return <div className="text-center">
            <div>
                Submission for {urlSubmissionResult.type} on platform {urlSubmissionResult.platform} with ID {urlSubmissionResult.idOnPlatform} successfully processed.
            </div>
            <button className="btn btn-outline-primary" onClick={_ => reset()}>
                Submit another
            </button>
        </div>

        return <div className="text-center">
            <h2>Add a YouTube link to the archive</h2>
            <form onSubmit={onSubmit}>
                <div>
                    {displayError ?
                        <div className="text-danger">
                            {displayError}
                        </div> : <></>}
                    <label htmlFor="urlSubmissionLink">Link:</label>
                    <input id="urlSubmissionLink" name="link"
                        value={urlSubmissionData.link}
                        onChange={e => handleChangeEvent(e, setUrlSubmissionData)} />
                </div>
                <div>
                    <label htmlFor="alsoSubmitPlaylist">Also submit playlist, if link is a video+playlist link:</label>
                    <input id="alsoSubmitPlaylist" type="checkbox" name="submitPlaylist"
                        checked={urlSubmissionData.submitPlaylist}
                        onChange={e => handleChangeEvent(e, setUrlSubmissionData)} />
                </div>
                <input type="submit" onClick={onSubmit} value="Submit" className="btn btn-primary" />
            </form>
        </div>
    }

    if (authContext.jwt) return <h2 className="text-center">
        Sorry, you are not authorized to submit a link to the archive
    </h2>

    return <p className="text-center">Log in with an authorized account to submit a link to the archive</p>
}

export default SubmitUrl;