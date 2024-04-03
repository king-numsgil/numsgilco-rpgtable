import { RouteObject } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { trpc } from 'trpc';
import { FC } from 'react';

const Encounter: FC = () => {
    const pingQuery = trpc.ping.useQuery();

    return <>
        <Helmet>
            <title>Encounter | Combat - NumsgilCo Tabletop</title>
        </Helmet>
        <h1>Vite + React ({pingQuery.data})</h1>
    </>;
};

const route: RouteObject = {
    path: "encounter",
    element: <Encounter />,
};
export default route;
