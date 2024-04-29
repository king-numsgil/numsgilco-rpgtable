//import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FC } from 'react';

//import { trpc, type RouterOutputs, RouterInputs } from 'trpc';
//import { useLazyEffect } from 'utils';

export const FeatPage: FC = () => {
    //const { featId } = useParams();

    return <>
        <Helmet>
            <title>Feat | Database - NumsgilCo Tabletop</title>
        </Helmet>
        <h1>Pathfinder Feats Database</h1>
    </>;
};
