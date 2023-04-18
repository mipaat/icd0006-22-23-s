import { MouseEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DecodedJWT } from "../../dto/DecodedJWT";
import { isIJwtResponse } from "../../dto/IJWTResponse";
import { RefreshToken } from "../../dto/IRefreshToken";
import { IRegisterData } from "../../dto/IRegisterData";
import { isIRestApiErrorResponse } from "../../dto/IRestApiErrorResponse";
import { IdentityService } from "../../services/IdentityService";
import { AuthContext } from "../Root";
import RegisterFormView from "./RegisterFormView";

const Register = () => {
    const navigate = useNavigate();

    const [values, setInput] = useState({
        password: "",
        confirmPassword: "",
        email: ""
    } as IRegisterData);

    const [validationErrors, setValidationErrors] = useState([] as string[]);

    const handleChange = (target: EventTarget & HTMLInputElement) => {
        setInput({ ...values, [target.name]: target.value });
    }

    const { authState: jwtResponse, updateAuthState } = useContext(AuthContext);

    const identityService = new IdentityService();

    const onSubmit = async (event: MouseEvent) => {
        console.log('onSubmit', event);
        event.preventDefault();

        const jwtResponse = await identityService.register(values);

        if (isIRestApiErrorResponse(jwtResponse)) {
            setValidationErrors([jwtResponse.error]);
            return;
        }

        if (!isIJwtResponse(jwtResponse)) {
            setValidationErrors(["Unknown error occurred"]);
            return;
        }

        if (updateAuthState) {
            updateAuthState(authState => {
                authState.jwt = new DecodedJWT(jwtResponse.jwt);
                authState.refreshToken = new RefreshToken(jwtResponse);
                return authState;
            });
            navigate("/");
        }
    }

    return (
        <RegisterFormView values={values} handleChange={handleChange} onSubmit={onSubmit} validationErrors={validationErrors} />
    );
}

export default Register;