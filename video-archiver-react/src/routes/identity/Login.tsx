import { MouseEvent, useContext, useState } from 'react';
import { ILoginData } from '../../dto/ILoginData';
import { AuthContext, IdentityServiceContext } from '../Root';
import LoginFormView from './LoginFormView';
import { useNavigate } from 'react-router-dom';
import { isIJwtResponse } from '../../dto/IJWTResponse';
import { isIRestApiErrorResponse } from '../../dto/IRestApiErrorResponse';
import { DecodedJWT } from '../../dto/DecodedJWT';
import { RefreshToken } from '../../dto/IRefreshToken';

const Login = () => {
    const navigate = useNavigate();

    const [values, setInput] = useState({
        username: '',
        password: ''
    } as ILoginData);
    const [pendingApproval, setPendingApproval] = useState(false);

    const [validationErrors, setValidationErrors] = useState([] as string[]);

    const handleChange = (target: EventTarget & HTMLInputElement) => {
        setInput({ ...values, [target.name]: target.value });
    };

    const { updateAuthState } = useContext(AuthContext);

    const identityService = useContext(IdentityServiceContext);

    const onSubmit = async (event: MouseEvent) => {
        event.preventDefault();

        if (values.username.length === 0 || values.password.length === 0) {
            setValidationErrors(['Bad input values!']);
            return;
        }
        // remove errors
        setValidationErrors([]);
        setPendingApproval(false);

        const jwtResponse = await identityService.login(values);

        if (isIRestApiErrorResponse(jwtResponse)) {
            if (jwtResponse.status === 401) {
                setPendingApproval(true);
            } else {
                setValidationErrors([jwtResponse.error]);
            }
            return;
        }

        if (!isIJwtResponse(jwtResponse)) {
            setValidationErrors(['Unknown error occurred']);
            return;
        }

        if (updateAuthState) {
            updateAuthState({
                jwt: new DecodedJWT(jwtResponse.jwt),
                refreshToken: new RefreshToken(jwtResponse)
            });
            navigate('/');
        }
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
