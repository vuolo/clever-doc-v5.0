import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const fileRouter = createTRPCRouter({
  addFileDetails: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        size: z.bigint(),
        client_id: z.string().optional(),
        structure_name: z.string().optional(),
        structure_description: z.string().optional(),
        hash: z.string(),
        path: z.string(),
        category: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.file_details.create({
        data: { ...input, owner_id: ctx.session.user.id },
      });
    }),
});
