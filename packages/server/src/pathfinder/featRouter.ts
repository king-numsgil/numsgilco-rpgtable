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
                    required_by: {
                        parent: true,
                    },
                    requisite_feats: {
                        feat: true,
                    },
                    requisite_skills: true,
                    requisite_special: true,
                    requisite_stats: true,
                },
            });
        }),

    find: seededProcedure
        .input(z.object({
            cursor: z.number().min(0).default(0),
            pageLength: z.number().min(1).default(9),
            name: z.string().optional(),
            type: z.enum([
                "General",
                "Combat",
                "Item creation",
                "Metamagic",
                "Monster",
                "Grit",
                "Panache",
                "Achievement",
                "Story",
                "Mythic",
                "Familiar",
                "Teamwork",
                "Meditation",
                "Conduit",
                "Critical",
                "Style",
                "Performance",
                "Racial",
                "Companion/Familiar",
                "Betrayal",
                "Targeting",
                "Esoteric",
                "Stare",
                "Weapon mastery",
                "Item mastery",
                "Armor mastery",
                "Shield mastery",
                "Blood hex",
                "Trick",
            ]).optional(),
        }))
        .query(async ({ input, ctx }) => {
            const repo = ctx.dataSource.getRepository(Feat);
            const query = repo.createQueryBuilder()
                .leftJoinAndSelect("Feat.required_by", "required_by")
                .leftJoinAndSelect("required_by.parent", "required_by_feat")
                .leftJoinAndSelect("Feat.requisite_feats", "requisite_feats")
                .leftJoinAndSelect("requisite_feats.feat", "requisite_feats_feat")
                .leftJoinAndSelect("Feat.requisite_skills", "requisite_skills")
                .leftJoinAndSelect("Feat.requisite_stats", "requisite_stats")
                .leftJoinAndSelect("Feat.requisite_special", "requisite_special");

            if (input.name) {
                query.andWhere(`Feat.name ILIKE :name`, { name: `%${input.name}%` });
            }

            if (input.type) {
                query.andWhere(`Feat.type ILIKE :type`, { type: `%${input.type}%` });
            }

            query.orderBy("Feat.name", "ASC").take(input.pageLength).skip(input.cursor * input.pageLength);
            const [feats, count] = await query.getManyAndCount();

            return {
                pageLength: input.pageLength,
                currentPage: input.cursor,
                count,
                feats,
            };
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
