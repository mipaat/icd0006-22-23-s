import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../routes/Root";
import { DecodedJWT } from "../dto/identity/DecodedJWT";
import { IRefreshToken } from "../dto/identity/IRefreshToken";
import { IdentityService } from "../services/IdentityService";

const IdentityHeader = () => {
    const { jwt, setJwt, refreshToken, setRefreshToken, setSelectedAuthor } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const identityService = new IdentityService();

    const logout = async () => {
        setJwt!(null);
        setRefreshToken!(null);
        setSelectedAuthor!(null);
        if (jwt && refreshToken) {
            await identityService.logout(jwt, refreshToken);
        }
        navigate("/");
    }

    if (jwt && refreshToken) {
        return (
            <>
                <li className="nav-item">
                    <UserInfo jwt={jwt} refreshToken={refreshToken} />
                </li>
                <li className="nav-item">
                    <button onClick={(e) => {
                        e.preventDefault();
                        logout();
                    }} className="nav-link text-dark">Logout</button>
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
    jwt: DecodedJWT,
    refreshToken: IRefreshToken,
}

const UserInfo = (props: IUserInfoProps) => {
    return (
        <>
            {props.jwt.name}<br />
            JWT Expires: {props.jwt.expiresAt.toLocaleString()}<br />
            Refresh Token Expires: {props.refreshToken.expiresAt.toLocaleString()}<br />
        </>
    );
}

export default IdentityHeader;