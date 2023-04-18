import { createContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

import * as configJson from '../config.json';
import IConfig from "../config";
import { IAuthenticationContext } from "../dto/IAuthenticationContext";
import { LocalStorageService } from "../localStorage/LocalStorageService";
import { JWT_KEY, REFRESH_TOKEN_KEY } from "../localStorage/LocalStorageKeys";
import { DecodedJWT } from "../dto/DecodedJWT";
import { IAuthenticationState } from "../dto/IAuthenticationState";
import { IRefreshToken } from "../dto/IRefreshToken";
const config = configJson as IConfig;

export const ConfigContext = createContext<IConfig>(config);

export const AuthContext = createContext<IAuthenticationContext>({ authState: null, updateAuthState: null });

const Root = () => {
    const localStorageService = new LocalStorageService(config.localStorageKey);
    const storedJwt = localStorageService.getItem(JWT_KEY);
    const storedRefreshToken = localStorageService.getItem(REFRESH_TOKEN_KEY);
    let refreshToken: IRefreshToken | null = null;
    if (storedRefreshToken) {
        const parsedStoredRefreshToken = JSON.parse(storedRefreshToken);
        refreshToken = {
            token: parsedStoredRefreshToken['token'],
            expiresAt: new Date(parsedStoredRefreshToken['expiresAt']),
        }
    }

    const [authState, _updateAuthState] = useState({
        jwt: storedJwt !== null ? new DecodedJWT(storedJwt) : null,
        refreshToken: refreshToken,
    } as IAuthenticationState);
    const updateAuthState = (updateFunc: (previousValue: IAuthenticationState) => IAuthenticationState) => {
        console.log("Before", authState);
        _updateAuthState(updateFunc);
        console.log("After", authState);
        if (authState.jwt) {
            localStorageService.setItem(JWT_KEY, authState.jwt.token);
        } else {
            localStorageService.removeItem(JWT_KEY);
        }
        if (authState.refreshToken) {
            localStorageService.setItem(REFRESH_TOKEN_KEY, authState.refreshToken);
        } else {
            localStorageService.removeItem(REFRESH_TOKEN_KEY);
        }
    }

    return (
        <ConfigContext.Provider value={config}>
            <AuthContext.Provider value={{ authState: authState, updateAuthState: updateAuthState }}>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
                    integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
                    crossOrigin="anonymous"
                />
                <Header />

                <div className="container">
                    <main role="main" className="pb-3">
                        <Outlet />
                    </main>
                </div>

                <Footer />
            </AuthContext.Provider>
        </ConfigContext.Provider>
    );
}

export default Root;