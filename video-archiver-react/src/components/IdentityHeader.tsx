import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ConfigContext, AuthContext, IdentityServiceContext } from "../routes/Root";
import { IdentityService } from "../services/IdentityService";
import { LocalStorageService } from "../localStorage/LocalStorageService";
import { REFRESH_TOKEN_KEY } from "../localStorage/LocalStorageKeys";
import { IAuthenticationState } from "../dto/IAuthenticationState";

const IdentityHeader = () => {
    const { authState, updateAuthState } = useContext(AuthContext);
    const config = useContext(ConfigContext);
    const navigate = useNavigate();
    const identityService = useContext(IdentityServiceContext);
    const localStorageService = new LocalStorageService(config.localStorageKey);

    const logout = () => {
        localStorageService.removeItem(REFRESH_TOKEN_KEY);
        if (authState)
            identityService.logout(authState).then(response => {
                if (updateAuthState)
                    updateAuthState({jwt: null, refreshToken: null});
                navigate("/");
            });
    }

    if (authState?.jwt && authState.refreshToken) {
        return (
            <>
                <li className="nav-item">
                    <Link to="info" className="nav-link text-dark">
                        <UserInfo authState={authState} />
                    </Link>
                </li>
                <li className="nav-item">
                    <a onClick={(e) => {
                        e.preventDefault();
                        logout();
                    }} className="nav-link text-dark" href="#">Logout</a>
                </li>
            </>
        );
    }
    return (
        <>
            <li className="nav-item">
                <Link to="register" className="nav-link text-dark">Register</Link>
            </li>
            <li className="nav-item">
                <Link to="login" className="nav-link text-dark">Login</Link>
            </li>
        </>
    );
}

interface IUserInfoProps {
    authState: IAuthenticationState
}

const UserInfo = (props: IUserInfoProps) => {
    const refreshTokenExpiresAt = props.authState.refreshToken?.expiresAt instanceof Date ? props.authState.refreshToken?.expiresAt : null;

    return (
        <>
            {props.authState.jwt?.name}<br />
            JWT Expires: {props.authState.jwt?.expiresAt instanceof Date ? props.authState.jwt?.expiresAt.toLocaleString() : null}<br />
            Refresh Token Expires: {refreshTokenExpiresAt?.toLocaleString()}<br />
        </>
    );
}

export default IdentityHeader;