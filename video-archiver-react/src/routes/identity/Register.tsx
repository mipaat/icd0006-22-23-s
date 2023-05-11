import { MouseEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DecodedJWT } from "../../dto/DecodedJWT";
import { IJWTResponse, isIJwtResponse } from "../../dto/IJWTResponse";
import { RefreshToken } from "../../dto/IRefreshToken";
import { IRegisterData } from "../../dto/IRegisterData";
import { IRestApiErrorResponse, isIRestApiErrorResponse } from "../../dto/IRestApiErrorResponse";
import { AuthContext, IdentityServiceContext } from "../Root";
import RegisterFormView from "./RegisterFormView";
import { isPendingApprovalError } from "../../dto/PendingApprovalError";

const Register = () => {
    const navigate = useNavigate();

    const [values, setInput] = useState({
        password: "",
        confirmPassword: "",
        username: ""
    } as IRegisterData);

    const [validationErrors, setValidationErrors] = useState([] as string[]);

    const handleChange = (target: EventTarget & HTMLInputElement) => {
        setInput({ ...values, [target.name]: target.value });
    }

    const { updateAuthState } = useContext(AuthContext);

    const identityService = useContext(IdentityServiceContext);

    const onSubmit = async (event: MouseEvent) => {
        event.preventDefault();

        if (values.username.length === 0 || values.password.length === 0) {
            setValidationErrors(["Bad input values!"])
            return;
        }
    
        if (values.password !== values.confirmPassword) {
            setValidationErrors(["Passwords must match!"])
            return;
        }

        setValidationErrors([]);

        let jwtResponse: IJWTResponse | IRestApiErrorResponse | undefined;
        try {
            jwtResponse = await identityService.register(values);
        } catch (e) {
            if (isPendingApprovalError(e)) {
                navigate("/pendingApproval");
                return;
            }
            setValidationErrors(["Unknown error occurred"]);
            return;
        }

        if (isIRestApiErrorResponse(jwtResponse)) {
            setValidationErrors([jwtResponse.error]);
            return;
        }

        if (!isIJwtResponse(jwtResponse)) {
            setValidationErrors(["Unknown error occurred"]);
            return;
        }

        if (updateAuthState) {
            updateAuthState({
                jwt: new DecodedJWT(jwtResponse.jwt),
                refreshToken: new RefreshToken(jwtResponse),
            });
            navigate("/");
        }
    }

    return (
        <RegisterFormView values={values} handleChange={handleChange} onSubmit={onSubmit} validationErrors={validationErrors} />
    );
}

export default Register;