import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import cookie, { type CookieSerializeOptions } from "cookie";
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

export async function createContext({ req, resHeaders }: FetchCreateContextFnOptions) {
    const getCookies = () => {
        const cookieHeader = req.headers.get("cookie");
        if (cookieHeader) {
            return cookie.parse(cookieHeader);
        }
        return {};
    }

    const getCookie = (name: string): string | undefined => {
        return getCookies()[name];
    }

    const setCookie = (name: string, value: string, options?: CookieSerializeOptions) => {
        const cookieHeader = cookie.serialize(name, value, options);
        if (cookieHeader) {
            resHeaders.append("Set-Cookie", cookieHeader);
        }
    }

    let token: string | null = null;
    if (req.headers.has("Authorization") && req.headers.get("Authorization")?.startsWith("Bearer ")) {
        token = req.headers.get("Authorization")?.split(" ")[1].trim() ?? null;
    }

    const dataSource = new DataSource({
        type: "postgres",
        host: Bun.env.NODE_ENV === "production" ? "pg" : "localhost",
        port: 5432,
        username: Env.pgUser,
        password: Env.pgPassword,
        database: Env.pgDb,
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
        getCookie,
        setCookie,
        dataSource,
        token,
        userId,
    };
}

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
//export const publicProcedure = t.procedure;

export const publicProcedure = t.procedure.use(async (opts) => {
    const start = Date.now();

    const result = await opts.next();

    const durationMs = Date.now() - start;
    const meta = { path: opts.path, type: opts.type, durationMs };

    result.ok
        ? console.log('OK request timing:', meta)
        : console.error('Non-OK request timing', meta);

    return result;
});

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
