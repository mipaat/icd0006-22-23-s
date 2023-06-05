import { FormEvent, MouseEvent, useContext, useEffect, useMemo, useState } from 'react';
import LoginFormView from './LoginFormView';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { isIRestApiErrorResponse } from '../../dto/IRestApiErrorResponse';
import { IdentityService } from '../../services/IdentityService';
import { IJWTResponse } from '../../dto/identity/IJWTResponse';
import { ERestApiErrorType } from '../../dto/enums/ERestApiErrorType';
import { DecodedJWT } from '../../dto/identity/DecodedJWT';
import { ILoginData } from '../../dto/identity/ILoginData';
import { RefreshToken } from '../../dto/identity/IRefreshToken';
import { AuthContext } from '../Root';
import { handleChangeEvent } from '../../utils/Utils';

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const returnUrl = searchParams.get("returnUrl");

    const [values, setInput] = useState({
        username: '',
        password: ''
    } as ILoginData);
    const [pendingApproval, setPendingApproval] = useState(false);

    const [validationErrors, setValidationErrors] = useState([] as string[]);
    const addValidationErrors = (...errors: string[]) => {
        setValidationErrors(previousErrors => [...previousErrors, ...errors]);
    }

    const identityService = useMemo(() => new IdentityService(), []);

    const { jwt, setJwt, refreshToken, setRefreshToken } = useContext(AuthContext);

    const [shouldLogOut, setShouldLogOut] = useState(true);

    useEffect(() => {
        if (!shouldLogOut) return;
        setShouldLogOut(false);
        setJwt!(null);
        setRefreshToken!(null);
    }, [identityService, jwt, refreshToken, setJwt, setRefreshToken, shouldLogOut])

    const [loginComplete, setLoginComplete] = useState(false);

    useEffect(() => {
        if (!loginComplete || !jwt || !refreshToken) return;
        navigate(returnUrl ?? "/");
    }, [jwt, loginComplete, navigate, refreshToken, returnUrl]);

    const onSubmit = async (event: MouseEvent | FormEvent) => {
        event.preventDefault();

        setShouldLogOut(false);
        setValidationErrors([]);
        setPendingApproval(false);

        if (values.username.length === 0 || values.password.length === 0) {
            addValidationErrors('Bad input values!');
            return;
        }

        let jwtResponse: IJWTResponse;
        try {
            jwtResponse = await identityService.login(values.username, values.password);
        } catch (e) {
            if (isIRestApiErrorResponse(e)) {
                if (e.error === ERestApiErrorType.UserNotApproved) {
                    setPendingApproval(true);
                } else {
                    setValidationErrors([e.error]);
                }
                return;
            }
            addValidationErrors("Unknown error occurred");
            return;
        }

        setJwt!(new DecodedJWT(jwtResponse.jwt));
        setRefreshToken!(new RefreshToken(jwtResponse));
        setLoginComplete(true); // This should trigger a navigate through another useEffect once the AuthContext updates have processed
    };

    return (
        <LoginFormView
            values={values}
            handleChange={e => handleChangeEvent<ILoginData>(e, setInput)}
            onSubmit={onSubmit}
            validationErrors={validationErrors}
            pendingApproval={pendingApproval}
        />
    );
};

export default Login;
