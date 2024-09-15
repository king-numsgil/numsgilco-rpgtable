import { z } from "zod";

import { router, publicProcedure } from "trpc";
import { Subdomain } from "./entities";

export const subdomainRouter = router({
    get: publicProcedure
        .input(z.object({
            id: z.string().uuid(),
        }))
        .query(async ({ input }) => {
            return await Subdomain.findOneOrFail({
                where: {
                    id: input.id,
                },
            });
        }),

    list: publicProcedure
        .query(async () => {
            const [subdomains, count] = await Subdomain.findAndCount({ order: { name: "ASC" } });
            return {
                count,
                subdomains,
            };
        }),
});
