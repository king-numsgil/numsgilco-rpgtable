import type { CreateBunContextOptions } from 'trpc-bun-adapter';
import { initTRPC, TRPCError } from "@trpc/server";
import { importSPKI, jwtVerify } from "jose";
import { DataSource } from "typeorm";

import { Env } from 'env';

type TokenPayload = {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
};

export async function createContext({ req }: CreateBunContextOptions) {
    let token: string | null = null;
    if (req.headers.has("Authorization") && req.headers.get("Authorization")?.startsWith("Bearer ")) {
        token = req.headers.get("Authorization")?.split(" ")[1].trim() ?? null;
    }

    const dataSource = new DataSource({
        type: "sqlite",
        database: "./server.sqlite",
        synchronize: true,
        entities: ["src/**/*.entity.ts"],
    });

    await dataSource.initialize();

    let userId: string | null = null;
    const publicKey = await importSPKI(Env.publicKey, "RS256");

    if (token !== null) {
        try {
            const { payload } = await jwtVerify<TokenPayload>(token, publicKey, {
                issuer: 'numsgilco:trpc',
                audience: 'numsgilco:table',
            });
            userId = payload.user.id;
        } catch (error: any) {
            userId = null;
        }
    }

    return {
        dataSource,
        token,
        userId,
    };
}

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use((opts) => {
    const { ctx } = opts;
    if (ctx.token === null || ctx.userId === null) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return opts.next({
        ctx: {
            ...ctx,
            token: ctx.token,
            userId: ctx.userId,
        }
    });
});