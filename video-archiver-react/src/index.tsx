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
import VideoWatch from './routes/video/VideoWatch';
import Forbidden from './routes/Forbidden';
import NotFound from './routes/NotFound';

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
                path: "forbid/",
                element: <Forbidden />
            },
            {
                path: "notFound/",
                element: <NotFound />
            },
            {
                path: "login/:returnUrl?",
                element: <Login />,
            },
            {
                path: "register/",
                element: <Register />,
            },
            {
                path: "pendingApproval/",
                element: <PendingApproval />
            },
            {
                path: 'videos/search/',
                element: <VideoSearch />
            },
            {
                path: 'video/watch/:id',
                element: <VideoWatch />
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
