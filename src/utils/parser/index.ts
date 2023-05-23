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

import bofa_business from "../../../public/images/parsers/bofa_business.png";
import regions_business from "../../../public/images/parsers/regions_business.png";
import wells_fargo_business from "../../../public/images/parsers/wells_fargo_business.png";
import accounting_cs from "../../../public/images/parsers/accounting_cs.jpeg";

export function getParserImage(
  parser: Parser
) {
    switch (parser) {
        case "bofa_business":
            return bofa_business
        case "regions_business":
            return regions_business
        case "wells_fargo_business":
            return wells_fargo_business
        case "accounting_cs":
            return accounting_cs
          
        default:
            return "";
    }
}

export function getParserName(parser: Parser) {
  switch (parser) {
    case "bofa_business":
      return "Bank of America (Business)";
    case "regions_business":
      return "Regions Bank (Business)";
    case "wells_fargo_business":
      return "Wells Fargo (Business)";
    case "accounting_cs":
      return "Accounting CS";
    case "quickbooks":
      return "QuickBooks";
    default:
      return parser
  }
}