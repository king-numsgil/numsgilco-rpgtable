import { z } from "zod";

import { router, publicProcedure } from "trpc";
import { Domain } from "./entities";

export const domainRouter = router({
    get: publicProcedure
        .input(z.object({
            id: z.string().uuid(),
        }))
        .query(async ({ input }) => {
            return await Domain.findOneOrFail({
                where: {
                    id: input.id,
                },
            });
        }),

    list: publicProcedure
        .query(async () => {
            const [domains, count] = await Domain.findAndCount({ order: { name: "ASC" } });
            return {
                count,
                domains,
            };
        }),
});
