import { z } from "zod";

import { router, publicProcedure } from "trpc";
import { Class, ClassSpell } from "./entities";

export const classRouter = router({
    get: publicProcedure
        .input(z.object({
            id: z.string().uuid(),
        }))
        .query(async ({ input }) => {
            return await Class.findOneOrFail({
                where: {
                    id: input.id,
                },
            });
        }),

    list: publicProcedure
        .input(z.object({
            spellcasting: z.boolean().optional(),
        }).optional())
        .query(async ({ input, ctx }) => {
            const query = ctx.dataSource.getRepository(Class).createQueryBuilder("cl");
            query.orderBy("name", "ASC");

            if (input) {
                if (input.spellcasting === true) {
                    query.where(qb => {
                        const sub = qb.subQuery()
                            .select("COUNT(*)")
                            .from(ClassSpell, "cls")
                            .where("cls.classId = cl.id")
                            .getQuery();

                        return `${sub} > 0`;
                    });
                }
            }

            const [classes, count] = await query.getManyAndCount();
            return {
                count,
                classes,
            };
        }),
});
