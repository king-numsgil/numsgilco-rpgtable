import { router, publicProcedure, createContext } from 'trpc';
import { pathfinderRouter } from 'pathfinder';
import { utilsRouter } from 'utils';
import { userRouter } from 'user';

const appRouter = router({
    pathfinder: pathfinderRouter,
    utils: utilsRouter,
    user: userRouter,
    ping: publicProcedure
        .query(({ ctx }) => {
            if (ctx.token !== null) {
                console.log(`Received auth token : ${ctx.token}`);
            }
            return `pong ${ctx.dataSource.isInitialized ? 'GO' : 'erm...'}`;
        }),
});

export type AppRouter = typeof appRouter;

import { trpcServer } from '@hono/trpc-server';
import { Hono } from "hono";

const hono = new Hono();
hono.use(
    "/trpc/*",
    trpcServer({
        endpoint: "/trpc",
        router: appRouter,
        createContext,
    }),
);

export default hono;
