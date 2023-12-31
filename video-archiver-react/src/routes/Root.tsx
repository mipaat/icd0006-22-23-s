import { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

import { JWT_KEY, REFRESH_TOKEN_KEY, SELECTED_AUTHOR_KEY } from "../localStorage/LocalStorageKeys";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { IRefreshToken } from "../dto/identity/IRefreshToken";
import { DecodedJWT } from "../dto/identity/DecodedJWT";
import { IUserSubAuthor } from "../dto/identity/IUserSubAuthor";
import { IAuthenticationContext } from "../contexts/IAuthenticationContext";
import ErrorBoundary from "../components/ErrorBoundary";

export const AuthContext = createContext<IAuthenticationContext>({
    jwt: null, setJwt: null,
    refreshToken: null, setRefreshToken: null,
    selectedAuthor: null, setSelectedAuthor: null,
    ongoingRefreshPromise: null, setOngoingRefreshPromise: null,
});

const Root = () => {
    const storedJwt = localStorage.getItem(JWT_KEY);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedSelectedAuthor = localStorage.getItem(SELECTED_AUTHOR_KEY);

    let readRefreshToken: IRefreshToken | null = null;
    if (storedRefreshToken) {
        const parsedStoredRefreshToken = JSON.parse(storedRefreshToken);
        readRefreshToken = {
            token: parsedStoredRefreshToken['token'],
            expiresAt: new Date(parsedStoredRefreshToken['expiresAt']),
        }
    }

    let readSelectedAuthor: IUserSubAuthor | null = null;
    if (storedSelectedAuthor) {
        const parsedStoredSelectedAuthor = JSON.parse(storedSelectedAuthor);
        readSelectedAuthor = {
            id: parsedStoredSelectedAuthor['id'],
            userName: parsedStoredSelectedAuthor['userName'],
            displayName: parsedStoredSelectedAuthor['displayName'],
        };
    }

    const [jwt, setJwt] = useState(storedJwt !== null ? new DecodedJWT(storedJwt) : null);
    const [refreshToken, setRefreshToken] = useState(readRefreshToken);
    const [selectedAuthor, setSelectedAuthor] = useState(readSelectedAuthor);
    const [ongoingRefreshPromise, setOngoingRefreshPromise] = useState(null as Promise<string | null> | null);

    useEffect(() => {
        if (jwt) {
            localStorage.setItem(JWT_KEY, jwt.token);
        } else {
            localStorage.removeItem(JWT_KEY);
        }
        if (refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(refreshToken));
        } else {
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
        if (selectedAuthor) {
            localStorage.setItem(SELECTED_AUTHOR_KEY, JSON.stringify(selectedAuthor))
        } else {
            localStorage.removeItem(SELECTED_AUTHOR_KEY);
        }
    }, [jwt, refreshToken, selectedAuthor]);

    return (
        <AuthContext.Provider value={{
            jwt, setJwt,
            refreshToken, setRefreshToken,
            selectedAuthor, setSelectedAuthor,
            ongoingRefreshPromise, setOngoingRefreshPromise
        }}>
            <ErrorBoundary>
                <Header />

                <div className="container">
                    <main role="main" className="pb-3">
                        <Outlet />
                    </main>
                </div>
            </ErrorBoundary>
        </AuthContext.Provider>
    );
}

export default Root;