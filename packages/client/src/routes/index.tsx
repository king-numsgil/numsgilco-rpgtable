import { RouteObject, Outlet } from "react-router-dom";

import { RootLayout } from "components";
import { routes as database } from "./database";
import { routes as combat } from "./combat";
import Home from "./Home";

export const routes: Array<RouteObject> = [
    {
        path: "/",
        element: <RootLayout><Outlet /></RootLayout>,
        children: [
            ...combat,
            ...database,
            Home,
        ],
    },
];