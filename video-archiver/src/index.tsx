import React from 'react';
import ReactDOM from 'react-dom/client';

import {
    createBrowserRouter,
    Navigate,
    RouterProvider
} from "react-router-dom"
import Root from './routes/Root';
import ErrorPage from './routes/ErrorPage';
import Home from './routes/Home';
import Login from './routes/identity/Login';
import Register from './routes/identity/Register';
import GameIndex from './routes/crud/game/Index';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "login/",
                element: <Login />,
            },
            {
                path: "register/",
                element: <Register />,
            },
            {
                path: "crud/",
                children: [
                    {
                        path: "game/",
                        element: <GameIndex />,
                        children: [
                            {
                                path: "index/",
                                element: <GameIndex />
                            }
                        ]
                    }
                ]
            },
        ]
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
