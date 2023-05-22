import type {
  AnalyzeResult,
  AnalyzedDocument,
} from "@azure/ai-form-recognizer";
import type { Account } from "~/types/account";
import type { Transaction } from "~/types/transaction";
import type { Parser } from "~/types/misc";

import { parseGeneralLedgerFormRecognizerResult_AccountingCS } from "./general-ledgers/pdf/accounting_cs";
import { parseBankStatementFormRecognizerResult_BofaBusiness } from "./bank-statements/pdf/bofa_business";

export function parseGeneralLedgerFormRecognizerResult(
  result: AnalyzeResult<AnalyzedDocument>,
  software_name: Parser
): Account[] | void {
  switch (software_name) {
    case "accounting_cs":
      return parseGeneralLedgerFormRecognizerResult_AccountingCS(result);
    default:
      throw new Error(`Unknown software name: "${software_name as string}"`);
  }
}

export function parseBankStatementFormRecognizerResult(
  result: AnalyzeResult<AnalyzedDocument>,
  bank_name: Parser
): Transaction[] | void {
  switch (bank_name) {
    case "bofa_business":
      return parseBankStatementFormRecognizerResult_BofaBusiness(result);
    default:
      throw new Error(`Unknown bank name: "${bank_name as string}"`);
  }
}