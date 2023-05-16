import type { Transaction } from "./transaction";

export type CodedTransaction = Transaction & {
  coded_entry: string;
  account_guesses: {
    account: {
      name: string;
      number: string;
    };
    confidence: number;
  }[];
  selectedAccountGuessIndex?: number;
  manualAccountOverride?: {
    enabled: boolean;
    account: {
      name: string;
      number: string;
    };
  };
};
