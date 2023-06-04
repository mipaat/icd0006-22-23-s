import { MouseEvent, useContext, useState } from 'react';
import LoginFormView from './LoginFormView';
import { useNavigate, useParams } from 'react-router-dom';
import { isIRestApiErrorResponse } from '../../dto/IRestApiErrorResponse';
import { IdentityService } from '../../services/IdentityService';
import { IJWTResponse } from '../../dto/identity/IJWTResponse';
import { ERestApiErrorType } from '../../dto/enums/ERestApiErrorType';
import { DecodedJWT } from '../../dto/identity/DecodedJWT';
import { ILoginData } from '../../dto/identity/ILoginData';
import { RefreshToken } from '../../dto/identity/IRefreshToken';
import { AuthContext } from '../Root';

const Login = () => {
    const navigate = useNavigate();
    let { returnUrl } = useParams();

    const [values, setInput] = useState({
        username: '',
        password: ''
    } as ILoginData);
    const [pendingApproval, setPendingApproval] = useState(false);

    const [validationErrors, setValidationErrors] = useState([] as string[]);
    const addValidationErrors = (...errors: string[]) => {
        setValidationErrors(previousErrors => [...previousErrors, ...errors]);
    }

    const handleChange = (target: EventTarget & HTMLInputElement) => {
        setInput({ ...values, [target.name]: target.value });
    };

    const { setJwt, setRefreshToken } = useContext(AuthContext);

    const identityService = new IdentityService(navigate);

    const onSubmit = async (event: MouseEvent) => {
        event.preventDefault();

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
        navigate(returnUrl ?? "/");
    };

    return (
        <LoginFormView
            values={values}
            handleChange={handleChange}
            onSubmit={onSubmit}
            validationErrors={validationErrors}
            pendingApproval={pendingApproval}
        />
    );
};

export default Login;
