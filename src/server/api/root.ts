import { createTRPCRouter } from "~/server/api/trpc";
import { fileRouter } from "./routers/file";
import { gptRouter } from "./routers/gpt";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  file: fileRouter,
  gpt: gptRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
