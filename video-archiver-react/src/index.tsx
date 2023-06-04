import React from 'react';
import ReactDOM from 'react-dom/client';

import {
    createBrowserRouter, RouterProvider,
} from "react-router-dom"
import Root from './routes/Root';
import ErrorPage from './routes/ErrorPage';
import Home from './routes/Home';
import Login from './routes/identity/Login';
import Register from './routes/identity/Register';
import PendingApproval from './components/PendingApproval';
import VideoSearch from './routes/video/VideoSearch';

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
                path: "error/",
                element: <ErrorPage />
            },
            {
                path: "login/:returnUrl?",
                element: <Login />,
            },
            {
                path: "register/:returnUrl?",
                element: <Register />,
            },
            {
                path: "pendingApproval/",
                element: <PendingApproval />
            },
            {
                path: 'videos/search/',
                element: <VideoSearch />
            }
        ]
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

// TODO: Figure out how to stop StrictMode from calling everything (including API) twice
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
