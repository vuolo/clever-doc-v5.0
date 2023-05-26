import type { Transaction } from "./transaction";

export type CodedTransaction = Transaction & {
  coded_entry: string;
  account_guesses: {
    account: {
      name: string;
      number: string;
    };
    confidence: number;
    quantity?: number; // temp, for categorizer
  }[];
  // UI purposes:
  selected_account: {
    name: string;
    number: string;
  };
};
