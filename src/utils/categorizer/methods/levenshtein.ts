import levenshtein from "fast-levenshtein";
// fast-levenshtein - Levenshtein algorithm in Javascript
// Build Status NPM module NPM downloads Follow on Twitter

// A Javascript implementation of the Levenshtein algorithm with locale-specific collator support. This uses fastest-levenshtein under the hood.

// Features
// Works in node.js and in the browser.
// Locale-sensitive string comparisons if needed.
// Comprehensive test suite.

// Examples
// Default usage

// var levenshtein = require('fast-levenshtein');

// var distance = levenshtein.get('back', 'book');   // 2
// var distance = levenshtein.get('我愛你', '我叫你');   // 1

// Locale-sensitive string comparisons
// It supports using Intl.Collator for locale-sensitive string comparisons:

// var levenshtein = require('fast-levenshtein');
// levenshtein.get('mikailovitch', 'Mikhaïlovitch', { useCollator: true});
// // 1
import type { Account } from "~/types/account";
import type { CodedTransaction } from "~/types/coded-transaction";

// Reference:
// export type Account = {
//   name: string;
//   number: string;
//   entries: {
//     description: string;
//     quantity: number;
//   }[];
// };

// export type Transaction = {
//     date: string;
//     description: string;
//     amount: number;
//     id?: string; // for UI purposes
//   };

// export type CodedTransaction = Transaction & {
//   coded_entry: string;
//   account_guesses: {
//     account: {
//       name: string;
//       number: string;
//     };
//     confidence: number;
//   }[];
//   // UI purposes:
//   selected_account: {
//     name: string;
//     number: string;
//   }
// };

// This uses the Levenshtein distance algorithm, which is a simple way to compare two strings.
// It's not the best way to do this, but it's a good starting point.
// ------------------------------------------------------------------------------------------------
// * Goal of this function is to return an array of account guesses, sorted by confidence (highest to lowest). *
// • ALWAYS PLACE "SUSPENSE" at the end of the array.
// • Prioritize confidence in accounts with more similar coded entries.
//     - Example:
//     > Coded Entry (transaction) description: "ADP TAX"
//     > Account x: "PAYROLL TAXES PAYABLE" (1 entry with coded entry "ADP TAX")
//     > Account y: "SALARIES & WAGES" (40 entries with coded entry "ADP TAX")
//     > Transaction should be associated with Account y ("SALARIES & WAGES")
// • Include ALL accounts with similar coded entries in the account guesses.
// • Provide at least 3 guesses with confidence scores.

// Important:
// - The confidence is a number between 0 and 1, where 1 is a perfect match.
export function makeAccountGuesses_levenshtein(
  codedEntry: string,
  accounts: Account[]
): CodedTransaction["account_guesses"] {
  const default_account = accounts.find(
    (account) => account.name === "SUSPENSE"
  ) as Account;
  let account_guesses = [] as CodedTransaction["account_guesses"];

  accounts.forEach((account) => {
    // Calculate the Levenshtein distance between the coded entry and each account's entries.
    account.entries.forEach((entry) => {
      const distance = levenshtein.get(codedEntry, entry.description);
      const confidence = 1 - distance / codedEntry.length;

      // For now, we are only including accounts with a confidence score of 0.75 or higher.
      if (confidence > 0.75)
        account_guesses.push({
          account: {
            name: account.name,
            number: account.number,
          },
          confidence,
          quantity: entry.quantity,
        });
    });
  });

  // By now, we will have an array of account guesses with confidence scores.
  // But, there may be duplicate accounts with different confidence scores.
  // For now, just remove the duplicates.
  account_guesses = account_guesses.filter(
    (account, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.account.name === account.account.name &&
          t.account.number === account.account.number
      )
  );

  return [
    ...account_guesses
      .sort((a, b) => b.confidence - a.confidence)
      .sort((a, b) => (b.quantity || 0) - (a.quantity || 0)),
    {
      account: {
        name: default_account.name,
        number: default_account.number,
      },
      confidence: 0,
    },
  ];
}
