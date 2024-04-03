import { RouteObject } from "react-router-dom";

import Spell from "./Spell";
import Feat from "./Feat";

export const routes: Array<RouteObject> = [
    {
        path: "database",
        children: [
            Spell,
            Feat,
        ],
    },
];