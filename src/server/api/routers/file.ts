import { z } from "zod";
import {
  type AnalyzeResult,
  type AnalyzedDocument,
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import {
  parseBankStatementFormRecognizerResult,
  parseGeneralLedgerFormRecognizerResult,
} from "~/utils/parser";
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
    uploadToFormRecognizer: protectedProcedure
    .input(
      z.object({
        fileUrl: z.string(),
        kind: z.enum(["general_ledger", "bank_statement", "n/a"]),
        dataset: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const apiKey = process.env.AZURE_FORM_RECOGNIZER_KEY;
      const endpoint = process.env.AZURE_FORM_RECOGNIZER_ENDPOINT;

      if (!apiKey || !endpoint) {
        console.error("Missing API key or endpoint.");
        return;
      }

      // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
      const client = new DocumentAnalysisClient(
        endpoint,
        new AzureKeyCredential(apiKey)
      );

      // begin the analysis process
      // TODO: figure out how to override the "no overload matches this call" error
      const poller = await client.beginAnalyzeDocument(
        "prebuilt-document",
        input.fileUrl as unknown
      );

      const result = await poller.pollUntilDone();

      return input.kind === "general_ledger"
        ? parseGeneralLedgerFormRecognizerResult(result)
        : input.kind === "bank_statement"
        ? parseBankStatementFormRecognizerResult(result)
        : result;
    }),
});
