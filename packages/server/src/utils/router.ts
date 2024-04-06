import { z } from "zod";

import { router, publicProcedure } from "trpc";
import { doDiceRoll } from "./diceRoll";

export const utilsRouter = router({
    doDiceRoll: publicProcedure
        .input(z.object({
            formula: z.string().toLowerCase(),
        }))
        .mutation(({ input }) => {
            return doDiceRoll(input.formula);
        }),
});