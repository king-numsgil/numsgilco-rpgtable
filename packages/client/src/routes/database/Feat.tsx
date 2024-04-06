import { Helmet } from 'react-helmet-async';
import { trpc } from 'trpc';
import { FC } from 'react';

export const FeatPage: FC = () => {
    const pingQuery = trpc.ping.useQuery();

    return <>
        <Helmet>
            <title>Feat | Database - NumsgilCo Tabletop</title>
        </Helmet>
        <h1>Vite + React ({pingQuery.data})</h1>
    </>;
};
