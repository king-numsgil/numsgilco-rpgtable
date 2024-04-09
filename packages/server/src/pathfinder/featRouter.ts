import { z } from "zod";

import { router, publicProcedure } from "trpc";
import { Feat } from "./entities";
import { seedFeats } from "./seed";

const seededProcedure = publicProcedure.use(async (opts) => {
    if (process.env.NODE_ENV !== "production") {
        if (await Feat.count() === 0) {
            await seedFeats();
        }
    }

    return opts.next();
});

export const featRouter = router({
    get: seededProcedure
        .input(z.object({
            id: z.string().uuid(),
        }))
        .query(async ({ input }) => {
            return await Feat.findOneOrFail({
                where: {
                    id: input.id,
                },
                relations: {
                    requisite_feats: true,
                    requisite_skills: true,
                    requisite_special: true,
                    requisite_stats: true,
                },
            });
        }),

    list: seededProcedure
        .query(async () => {
            const [mysteries, count] = await Feat.findAndCount({
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