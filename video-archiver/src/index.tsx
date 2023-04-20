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
import GameIndex from './routes/crud/game/Index';
import GameCreate from './routes/crud/game/Create';
import GameDetails from './routes/crud/game/Details';
import GameEdit from './routes/crud/game/Edit';
import GameDelete from './routes/crud/game/Delete';

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
                path: "crud/game/",
                element: <GameIndex />
            },
            {
                path: "crud/game/index/",
                element: <GameIndex />
            },
            {
                path: "crud/game/create/",
                element: <GameCreate />
            },
            {
                path: "crud/game/details/:id",
                element: <GameDetails />
            },
            {
                path: "crud/game/edit/:id",
                element: <GameEdit />
            },
            {
                path: "crud/game/delete/:id",
                element: <GameDelete />
            },
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
