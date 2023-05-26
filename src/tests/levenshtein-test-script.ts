import { makeAccountGuesses_levenshtein } from "../utils/categorizer/methods/levenshtein";
import dummyAccounts from "./dummy-data/DIAMOND_GIRL_27_AVE_INC/accounts";
import dummyCodedEntries from "./dummy-data/DIAMOND_GIRL_27_AVE_INC/coded_entries";

export function testAccountGuesses_levenshtein() {
  const coded_entries = [...dummyCodedEntries];
  const accounts = [...dummyAccounts];

  // Test for each coded entry
  coded_entries.forEach((coded_entry) => {
    const account_guesses = makeAccountGuesses_levenshtein(
      coded_entry,
      accounts
    );
    console.log(`Account guesses for "${coded_entry}":`, account_guesses);
  });
}
