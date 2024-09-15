import { z } from "zod";

import { router, publicProcedure } from "trpc";
import { Bloodline } from "./entities";

export const bloodlineRouter = router({
    get: publicProcedure
        .input(z.object({
            id: z.string().uuid(),
        }))
        .query(async ({ input }) => {
            return await Bloodline.findOneOrFail({
                where: {
                    id: input.id,
                },
            });
        }),

    list: publicProcedure
        .query(async () => {
            const [bloodlines, count] = await Bloodline.findAndCount({
                order: {
                    name: "ASC",
                }
            });
            return {
                count,
                bloodlines,
            };
        }),
});
