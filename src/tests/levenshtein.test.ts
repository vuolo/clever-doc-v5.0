import { makeAccountGuesses_levenshtein } from "../utils/categorizer/methods/levenshtein";
import dummyAccounts from "./dummy-data/DIAMOND_GIRL_27_AVE_INC/accounts";
import dummyCodedEntries from "./dummy-data/DIAMOND_GIRL_27_AVE_INC/coded_entries";

describe("makeAccountGuesses_levenshtein", () => {
  const coded_entries = [...dummyCodedEntries];
  const accounts = [...dummyAccounts];

  // Test for each coded entry
  coded_entries.forEach((coded_entry) => {
    test(`should return an array of account guesses for "${coded_entry}"`, () => {
      const account_guesses = makeAccountGuesses_levenshtein(
        coded_entry,
        accounts
      );
      expect(account_guesses).toBeDefined();
      expect(account_guesses.length).toBeGreaterThan(0);
    });
  });
});
