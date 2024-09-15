import { SignJWT, importPKCS8 } from "jose";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "trpc";
import { User } from "./User.entity";
import { Env } from "env";

export const userRouter = router({
    login: publicProcedure
        .input(z.object({
            email: z.string().email().toLowerCase(),
            password: z.string(),
        }))
        .mutation(async ({ input }) => {
            const user = await User.findOne({
                select: {
                    id: true,
                    email: true,
                    password: true,
                    firstName: true,
                    lastName: true,
                },
                where: {
                    email: input.email,
                },
            });

            if (!user) {
                throw new TRPCError({ code: "FORBIDDEN", message: "User not found or invalid password" });
            }

            if (!await user.verifyPassword(input.password)) {
                throw new TRPCError({ code: "FORBIDDEN", message: "User not found or invalid password" });
            }

            const privateKey = await importPKCS8(Env.privateKey, "RS256");
            const token = new SignJWT({
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            });

            return await token.setProtectedHeader({ alg: "RS256" })
                .setIssuedAt()
                .setAudience("numsgilco:table")
                .setIssuer("numsgilco:trpc")
                .setExpirationTime("1 week")
                .sign(privateKey);
        }),

    register: publicProcedure
        .input(z.object({
            email: z.string().email().toLowerCase(),
            password: z.string(),
            firstName: z.string(),
            lastName: z.string(),
        }))
        .mutation(async ({ input }) => {
            if (await User.findOneBy({ email: input.email })) {
                throw new TRPCError({ code: "CONFLICT", message: "Email already exists" });
            }

            const user = new User();
            user.email = input.email;
            user.firstName = input.firstName;
            user.lastName = input.lastName;
            await user.encryptPassword(input.password);
            const id = (await user.save()).id;

            const privateKey = await importPKCS8(Env.privateKey, "RS256");
            const token = new SignJWT({
                user: {
                    id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            });

            return await token.setProtectedHeader({ alg: "RS256" })
                .setIssuedAt()
                .setAudience("numsgilco:table")
                .setIssuer("numsgilco:trpc")
                .setExpirationTime("1 week")
                .sign(privateKey);
        }),

    me: protectedProcedure
        .query(async ({ ctx }) => {
            return await User.findOneOrFail({
                where: {
                    id: ctx.userId,
                },
            });
        }),
});
