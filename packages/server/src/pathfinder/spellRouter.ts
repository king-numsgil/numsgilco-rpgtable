import { z } from "zod";

import { seedClass, seedDomain, seedSpell } from "./seed";
import { router, publicProcedure } from "trpc";
import {
    Spell,
    Class,
    Domain,
    School,
    Subschool,
} from "./entities";

const seededProcedure = publicProcedure.use(async (opts) => {
    if (process.env.NODE_ENV !== "production") {
        const [classCount, domainCount, spellCount] = await Promise.all([
            Class.count(),
            Domain.count(),
            Spell.count(),
        ]);

        if (classCount === 0) {
            await seedClass();
        }

        if (domainCount === 0) {
            await seedDomain();
        }

        if (spellCount === 0) {
            await seedSpell();
        }
    }

    return opts.next();
});

export const spellRouter = router({
    school: router({
        get: seededProcedure
            .input(z.object({
                id: z.string().uuid(),
            }))
            .query(async ({ input }) => {
                return await School.findOneOrFail({
                    where: {
                        id: input.id,
                    },
                });
            }),
        list: seededProcedure
            .query(async () => {
                const [schools, count] = await School.findAndCount({ order: { name: "ASC" } });
                return {
                    count,
                    schools,
                };
            }),
    }),

    subschool: router({
        get: seededProcedure
            .input(z.object({
                id: z.string().uuid(),
            }))
            .query(async ({ input }) => {
                return await Subschool.findOneOrFail({
                    where: {
                        id: input.id,
                    },
                });
            }),
        list: seededProcedure
            .query(async () => {
                const [subschools, count] = await Subschool.findAndCount({ order: { name: "ASC" } });
                return {
                    count,
                    subschools,
                };
            }),
    }),

    get: seededProcedure
        .input(z.object({
            id: z.string().uuid(),
        }))
        .query(async ({ input }) => {
            return await Spell.findOneOrFail({
                where: {
                    id: input.id,
                },
            });
        }),

    find: seededProcedure
        .input(z.object({
            cursor: z.number().min(0).default(0),
            pageLength: z.number().min(1).default(9),
            name: z.string().optional(),
            school: z.string().uuid().optional(),
            subschool: z.string().uuid().optional(),
            class: z.string().uuid().optional(),
            domain: z.string().uuid().optional(),
            subdomain: z.string().uuid().optional(),
            patron: z.string().uuid().optional(),
            bloodline: z.string().uuid().optional(),
            mystery: z.string().uuid().optional(),
            spellLevel: z.number().min(0).max(9).optional(),
        }))
        .query(async ({ input, ctx }) => {
            const repo = ctx.dataSource.getRepository(Spell);
            const query = repo.createQueryBuilder()
                .leftJoinAndSelect("Spell.school", "school")
                .leftJoinAndSelect("Spell.subschool", "subschool")
                .leftJoinAndSelect("Spell.domains", "domain_spell")
                .leftJoinAndSelect("domain_spell.domain", "domain")
                .leftJoinAndSelect("Spell.subdomains", "subdomain_spell")
                .leftJoinAndSelect("subdomain_spell.subdomain", "subdomain")
                .leftJoinAndSelect("Spell.mysteries", "mystery_spell")
                .leftJoinAndSelect("mystery_spell.mystery", "mystery")
                .leftJoinAndSelect("Spell.patrons", "patron_spell")
                .leftJoinAndSelect("patron_spell.patron", "patron")
                .leftJoinAndSelect("Spell.bloodlines", "bloodline_spell")
                .leftJoinAndSelect("bloodline_spell.bloodline", "bloodline")
                .leftJoinAndSelect("Spell.classes", "class_spell")
                .leftJoinAndSelect("class_spell.class", "class")
                .leftJoinAndSelect("Spell.deity", "deity");

            if (input.name) {
                query.andWhere(`Spell.name LIKE :name`, { name: `%${input.name}%` });
            }

            if (input.school) {
                query.andWhere(`school.id = '${input.school}'`);
            }

            if (input.subschool) {
                query.andWhere(`subschool.id = '${input.subschool}'`);
            }

            if (input.class) {
                query.andWhere(`class.id = '${input.class}'`);
            }

            if (input.domain) {
                query.andWhere(`domain.id = '${input.domain}'`);
            }

            if (input.subdomain) {
                query.andWhere(`subdomain.id = '${input.subdomain}'`);
            }

            if (input.spellLevel) {
                if (input.class) {
                    query.andWhere(`class_spell.spell_level = ${input.spellLevel}`);
                }
                if (input.domain) {
                    query.andWhere(`domain_spell.spell_level = ${input.spellLevel}`);
                }
                if (input.subdomain) {
                    query.andWhere(`subdomain_spell.spell_level = ${input.spellLevel}`);
                }
                if (!input.class && !input.domain && !input.subdomain) {
                    query.andWhere(`(class_spell.spell_level = ${input.spellLevel} OR domain_spell.spell_level = ${input.spellLevel} OR subdomain_spell.spell_level = ${input.spellLevel})`);
                }
            }

            if (input.patron) {
                query.andWhere(`patron.id = '${input.patron}'`);
            }

            if (input.bloodline) {
                query.andWhere(`bloodline.id = '${input.bloodline}'`);
            }

            if (input.mystery) {
                query.andWhere(`mystery.id = '${input.mystery}'`);
            }

            query.orderBy("Spell.name", "ASC").take(input.pageLength).skip(input.cursor * input.pageLength);
            const [spells, count] = await query.getManyAndCount();

            return {
                pageLength: input.pageLength,
                currentPage: input.cursor,
                count,
                spells,
            };
        }),
});