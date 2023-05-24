import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { makeCodedEntries } from "~/utils/categorizer";

export const gptRouter = createTRPCRouter({
  makeCodedEntries: publicProcedure
    .input(
      z.object({
        transactionDescriptions: z.array(z.string()),
        codedEntries: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      return await makeCodedEntries(
        input.transactionDescriptions,
        input.codedEntries
      );
    }),
});
