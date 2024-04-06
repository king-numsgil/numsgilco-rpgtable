import { createBunServeHandler } from 'trpc-bun-adapter';

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

Bun.serve(createBunServeHandler({
    router: appRouter,
    endpoint: "/trpc",
    createContext,
}));
