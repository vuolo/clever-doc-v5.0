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
  // UI purposes:
  selected_account: {
    name: string;
    number: string;
  }
};
