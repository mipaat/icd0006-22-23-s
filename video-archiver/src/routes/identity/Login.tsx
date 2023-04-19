import { MouseEvent, useContext, useState } from "react";
import { ILoginData } from "../../dto/ILoginData";
import { IdentityService } from "../../services/IdentityService";
import { AuthContext } from "../Root";
import LoginFormView from "./LoginFormView";
import { useNavigate } from "react-router-dom";
import { isIJwtResponse } from "../../dto/IJWTResponse";
import { isIRestApiErrorResponse } from "../../dto/IRestApiErrorResponse";
import { DecodedJWT } from "../../dto/DecodedJWT";
import { RefreshToken } from "../../dto/IRefreshToken";

const Login = () => {
    const navigate = useNavigate();

    const [values, setInput] = useState({
        email: "",
        password: "",
    } as ILoginData);

    const [validationErrors, setValidationErrors] = useState([] as string[]);

    const handleChange = (target: EventTarget & HTMLInputElement) => {
        setInput({ ...values, [target.name]: target.value });
    }

    const { authState: jwtResponse, updateAuthState } = useContext(AuthContext);

    const identityService = new IdentityService();

    const onSubmit = async (event: MouseEvent) => {
        event.preventDefault();

        if (values.email.length === 0 || values.password.length === 0) {
            setValidationErrors(["Bad input values!"]);
            return;
        }
        // remove errors
        setValidationErrors([]);

        const jwtResponse = await identityService.login(values);

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
        <LoginFormView values={values} handleChange={handleChange} onSubmit={onSubmit} validationErrors={validationErrors} />
    );
}

export default Login;