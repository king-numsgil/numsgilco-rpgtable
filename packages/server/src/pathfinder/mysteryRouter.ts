import { z } from "zod";

import { router, publicProcedure } from "trpc";
import { Mystery } from "./entities";
import { seedMysteries } from "./seed";

const seededProcedure = publicProcedure.use(async (opts) => {
    if (process.env.NODE_ENV !== "production") {
        if (await Mystery.count() === 0) {
            await seedMysteries();
        }
    }

    return opts.next();
});

export const mysteryRouter = router({
    get: seededProcedure
        .input(z.object({
            id: z.string().uuid(),
        }))
        .query(async ({ input }) => {
            return await Mystery.findOneOrFail({
                where: {
                    id: input.id,
                },
            });
        }),

    list: seededProcedure
        .query(async () => {
            const [mysteries, count] = await Mystery.findAndCount({
                order: {
                    name: "ASC",
                }
            });
            return {
                count,
                mysteries,
            };
        }),
});
