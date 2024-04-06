import { RouteObject } from "react-router-dom";

export const routes: Array<RouteObject> = [
    {
        path: "database",
        children: [
            {
                path: "spell/:spellId?",
                async lazy() {
                    const { SpellPage } = await import("./Spell");
                    return {
                        Component: SpellPage,
                    };
                },
            },
            {
                path: "feat/:featId?",
                async lazy() {
                    const { FeatPage } = await import("./Feat");
                    return {
                        Component: FeatPage,
                    };
                },
            },
        ],
    },
];