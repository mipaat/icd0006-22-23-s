import { createContext, useEffect, useState } from "react";
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

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

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

    const [authState, updateAuthState] = useState({
        jwt: storedJwt !== null ? new DecodedJWT(storedJwt) : null,
        refreshToken: refreshToken,
    } as IAuthenticationState);

    useEffect(() => {
        if (authState.jwt) {
            localStorageService.setItem(JWT_KEY, authState.jwt.token);
        } else {
            localStorageService.removeItem(JWT_KEY);
        }
        if (authState.refreshToken) {
            localStorageService.setItem(REFRESH_TOKEN_KEY, JSON.stringify(authState.refreshToken));
        } else {
            localStorageService.removeItem(REFRESH_TOKEN_KEY);
        }
    }, [authState]);

    return (
        <ConfigContext.Provider value={config}>
            <AuthContext.Provider value={{ authState, updateAuthState }}>
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