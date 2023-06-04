import { MouseEvent, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IRestApiErrorResponse, isIRestApiErrorResponse } from "../../dto/IRestApiErrorResponse";
import RegisterFormView from "./RegisterFormView";
import { isPendingApprovalError } from "../../dto/PendingApprovalError";
import { DecodedJWT } from "../../dto/identity/DecodedJWT";
import { IJWTResponse } from "../../dto/identity/IJWTResponse";
import { RefreshToken } from "../../dto/identity/IRefreshToken";
import { IRegisterData } from "../../dto/identity/IRegisterData";
import { AuthContext } from "../Root";
import { IdentityService } from "../../services/IdentityService";
import { ERestApiErrorType } from "../../dto/enums/ERestApiErrorType";
import { handleChangeEvent } from "../../utils/Utils";

const Register = () => {
    const navigate = useNavigate();
    let { returnUrl } = useParams();

    const [values, setInput] = useState({
        password: "",
        confirmPassword: "",
        username: ""
    } as IRegisterData);

    const [validationErrors, setValidationErrors] = useState([] as string[]);
    const addValidationErrors = (...errors: string[]) => {
        setValidationErrors(previous => [...previous, ...errors])
    }

    const { setJwt, setRefreshToken } = useContext(AuthContext);
    setJwt!(null);
    setRefreshToken!(null);

    const identityService = new IdentityService();

    const onSubmit = async (event: MouseEvent) => {
        event.preventDefault();

        setValidationErrors([]);

        if (values.username.length === 0 || values.password.length === 0) {
            addValidationErrors("Bad input values!")
            return;
        }

        if (values.password !== values.confirmPassword) {
            addValidationErrors("Passwords must match!")
            return;
        }

        let jwtResponse: IJWTResponse | IRestApiErrorResponse | undefined;
        try {
            jwtResponse = await identityService.register(values.username, values.password);
        } catch (e) {
            if (isPendingApprovalError(e)) {
                navigate("/pendingApproval");
                return;
            }
            if (isIRestApiErrorResponse(e) && [ERestApiErrorType.InvalidRegistrationData, ERestApiErrorType.UserAlreadyRegistered].includes(e.errorType)) {
                addValidationErrors(e.error);
                return;
            }
            addValidationErrors("Unknown error occurred");
            return;
        }

        setJwt!(new DecodedJWT(jwtResponse.jwt));
        setRefreshToken!(new RefreshToken(jwtResponse));
        navigate(returnUrl ?? "/");
    }

    return (
        <RegisterFormView
            values={values}
            handleChange={v => handleChangeEvent<IRegisterData>(v, setInput)}
            onSubmit={onSubmit}
            validationErrors={validationErrors} />
    );
}

export default Register;