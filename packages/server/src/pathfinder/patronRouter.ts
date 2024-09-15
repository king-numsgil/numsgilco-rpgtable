import { z } from "zod";

import { router, publicProcedure } from "trpc";
import { Patron } from "./entities";

export const patronRouter = router({
    get: publicProcedure
        .input(z.object({
            id: z.string().uuid(),
        }))
        .query(async ({ input }) => {
            return await Patron.findOneOrFail({
                where: {
                    id: input.id,
                },
            });
        }),

    list: publicProcedure
        .query(async () => {
            const [patrons, count] = await Patron.findAndCount({
                order: {
                    name: "ASC",
                }
            });
            return {
                count,
                patrons,
            };
        }),
});
