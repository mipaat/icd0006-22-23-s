import { useLocation, useNavigate } from "react-router-dom";
import { LoginRequiredError } from "../errors/LoginRequiredError";
import React from "react";
import { isAxiosError } from "axios";
import { isReturnablePath } from "../utils/IdentityUtils";

interface IProps {
    children: React.ReactNode,
}

const ErrorBoundary = (props: IProps) => {
    const [error, setError] = React.useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const promiseRejectionHandler = React.useCallback((event: PromiseRejectionEvent) => {
        const reason = event.reason;
        if (reason instanceof LoginRequiredError) {
            event.preventDefault();
            let loginPath = "/login";
            if (!isReturnablePath(location.pathname)) {
                loginPath += "?returnUrl=" + encodeURIComponent(location.pathname + location.search);
            }
            navigate(loginPath);
            return;
        }
        if (isAxiosError(reason)) {
            if (reason.response?.status === 404) {
                event.preventDefault();
                navigate('/notFound');
                return;
            }
            if (reason.response?.status === 403) {
                event.preventDefault();
                navigate('/forbid');
                return;
            }
        }
        setError("Unknown error occurred");
    }, [navigate, location]);

    React.useEffect(() => {
        window.addEventListener("unhandledrejection", promiseRejectionHandler);

        return () => {
            window.removeEventListener("unhandledrejection", promiseRejectionHandler);
        };
        /* eslint-disable react-hooks/exhaustive-deps */
    }, []);

    const ErrorPopup = () => {
        return error ? (<>
            <div style={{ zIndex: 10, position: "absolute" }} className="rounded rounded-3 m-3 p-3 bg-danger d-flex gap-2">
                <h2 className="text-white">{error.toString()}</h2>
                <button className="ms-2 btn btn-close-white" onClick={() => setError("")} />
            </div>
        </>) : <></>
    };

    return <>
        <ErrorPopup />
        <>{props.children}</>
    </>
};

export default ErrorBoundary;