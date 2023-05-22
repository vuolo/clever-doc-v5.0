import { z } from "zod";
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
  type FormRecognizerRequestBody,
} from "@azure/ai-form-recognizer";
import {
  parseBankStatementFormRecognizerResult,
  parseGeneralLedgerFormRecognizerResult,
} from "~/utils/parser";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { Parser } from "~/types/misc";

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
        results: z.any().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.file_details.create({
        data: { ...input, structure_name: input.category === "general_ledger" ? "General Ledger" : input.category === "bank_statement" ? "Bank Statement" : undefined, owner_id: ctx.session.user.id },
      });
    }),
    updateFileDetails: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        size: z.bigint().optional(),
        client_id: z.string().optional(),
        structure_name: z.string().optional(),
        structure_description: z.string().optional(),
        hash: z.string(),
        path: z.string().optional(),
        category: z.string().optional(),
        results: z.any().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.file_details.updateMany({
        where: { hash: input.hash },
        data: { ...input, structure_name: input.category === "general_ledger" ? "General Ledger" : input.category === "bank_statement" ? "Bank Statement" : undefined },
      });
    }),
    uploadToFormRecognizer: protectedProcedure
    .input(
      z.object({
        fileUrl: z.string(),
        kind: z.enum(["general_ledger", "bank_statement", "n/a"]),
        parser: z.string()
      })
    )
    .mutation(async ({ input }) => {
      if (input.kind === "n/a") {
        console.error("File kind is 'n/a'.");
        return;
      }
      if (input.parser === "n/a") {
        console.error("Parser is 'n/a'.");
        return;
      }

      console.log("Uploading to Form Recognizer...");
      console.log("File URL:", input.fileUrl);
      console.log("File kind:", input.kind);
      console.log("Parser:", input.parser);

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
      const poller = await client.beginAnalyzeDocument(
        "prebuilt-document",
        input.fileUrl as unknown as FormRecognizerRequestBody
      );

      const result = await poller.pollUntilDone();

      return input.kind === "general_ledger"
        ? parseGeneralLedgerFormRecognizerResult(result, input.parser as Parser)
        : input.kind === "bank_statement"
        ? parseBankStatementFormRecognizerResult(result, input.parser as Parser)
        : result;
    }),
});
