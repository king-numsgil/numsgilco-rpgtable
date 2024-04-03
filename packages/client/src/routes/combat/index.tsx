import { RouteObject } from "react-router-dom";

import Initiative from "./Initiative";
import Encounter from "./Encounter";
import Party from "./Party";

export const routes: Array<RouteObject> = [
    {
        path: "combat",
        children: [
            Initiative,
            Encounter,
            Party,
        ],
    },
];