import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/auth-helpers-nextjs";
import Header from "./header";
import {
  ArrowRightFromLine,
  ChevronDown,
  Cog,
  Share,
  Share2,
  Wand2,
} from "lucide-react";
import TableCodedTransactions from "./table-coded-transactions";
import Alert from "./alert";
import type { file_details } from "~/types/file";
import type { Account } from "~/types/account";
import type { CodedTransaction } from "~/types/coded-transaction";
import type { Transaction } from "~/types/transaction";
import { Switch } from "@headlessui/react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { estimateTokens, toastMessage } from "~/utils/helpers";
import {
  buildCodedEntriesMessages,
  makeAccountGuesses,
} from "~/utils/categorizer";
import {
  type ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { testAccountGuesses_levenshtein } from "~/tests/levenshtein-test-script";

type Props = {
  user: User;
  generalLedger?: file_details;
  bankStatements?: file_details[];
};

export default function Categorize({
  user,
  generalLedger,
  bankStatements,
}: Props) {
  const [message, setMessage] = useState<string>("");
  const [codedTransactions, setCodedTransactions] = useState<
    CodedTransaction[]
  >([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [includeDebits, setIncludeDebits] = useState<boolean>(true);
  const [includeDeposits, setIncludeDeposits] = useState<boolean>(false);
  const [selectedStatement, setSelectedStatement] = useState<string>("");
  const [isCoding, setIsCoding] = useState<boolean>(false);
  if (typeof window !== "undefined")
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (window as any).testAccountGuesses_levenshtein =
      testAccountGuesses_levenshtein;

  const makeCodedEntries = api.gpt.makeCodedEntries.useMutation({
    onError: (error) => {
      toast.error(
        toastMessage(
          "An error occurred while trying to make coded entries.",
          error.message ?? "Unknown error"
        )
      );
      console.error("Error:", error);
      setIsCoding(false);
    },
  });

  const updateCodedEntry = (index: number, codedEntry: string) => {
    setCodedTransactions((prevTransactions) =>
      prevTransactions.map((transaction, i) =>
        i === index
          ? { ...transaction, coded_entry: codedEntry }
          : { ...transaction }
      )
    );
  };

  const updateSelectedAccount = (index: number, accountNumber: string) => {
    setCodedTransactions((prevTransactions) =>
      prevTransactions.map((transaction, i) =>
        i === index
          ? {
              ...transaction,
              selected_account: accounts.find(
                (a) => a.number === accountNumber
              ) || {
                number: "3130",
                name: "SUSPENSE",
              },
            }
          : { ...transaction }
      )
    );
  };

  // Listen for changes in the bank statements
  useEffect(() => {
    // If the selected statement is not in the list of bank statements, reset codedTransactions.
    if (
      (!bankStatements?.some((bs) => bs.hash === selectedStatement) &&
        selectedStatement) ||
      !selectedStatement
    )
      setCodedTransactions([]);

    if (bankStatements?.length === 0) setSelectedStatement("");

    if (!selectedStatement && bankStatements && bankStatements?.length > 0)
      setSelectedStatement(bankStatements[0]?.hash || "");
  }, [bankStatements, selectedStatement]);

  useEffect(() => {
    setCodedTransactions([]);
  }, [selectedStatement]);

  const categorizeTransactions = useCallback(async () => {
    if (!generalLedger?.results || !bankStatements?.length) return;

    setIsCoding(true);

    // Get the general ledger accounts
    const accounts = generalLedger.results as Account[];
    setAccounts(accounts);
    console.log("accounts:", accounts);

    // Get the selected bank statement
    const selectedBankStatement = bankStatements.find(
      (bs) => bs.hash === selectedStatement
    );
    if (!selectedBankStatement) return;

    // Get the bank statement transactions
    const transactions = selectedBankStatement.results as Transaction[];

    // Filter transactions based on includeDebits & includeDeposits state
    const filteredTransactions =
      includeDebits && !includeDeposits
        ? transactions.filter((transaction) => transaction.amount < 0)
        : !includeDebits && includeDeposits
        ? transactions.filter((transaction) => transaction.amount >= 0)
        : transactions;
    console.log("filteredTransactions:", filteredTransactions);

    // Clear coded transactions
    setCodedTransactions([]);

    try {
      const transactionDescriptions = filteredTransactions.map(
        (transaction) => transaction.description
      );
      const codedEntries = [
        ...new Set(
          accounts.reduce((descriptions: string[], account: Account) => {
            const accountDescriptions = account.entries.map(
              (entry) => entry.description
            );
            return [...descriptions, ...accountDescriptions];
          }, [])
        ),
      ];
      console.log("Sending to openai chat completion api...");
      console.log("transactionDescriptions:", transactionDescriptions);
      console.log("codedEntries:", codedEntries);

      const [estimatedPromptTokens, estimatedSampledTokens] = [
        estimateTokens(
          buildCodedEntriesMessages(transactionDescriptions, codedEntries)
        ),
        estimateTokens([
          {
            role: ChatCompletionRequestMessageRoleEnum.Assistant,
            content: JSON.stringify(transactionDescriptions),
          },
        ] as Array<ChatCompletionRequestMessage>),
      ];
      console.log("--- ESTIMATED COSTS ---");
      console.log("# of Prompt Tokens (input tokens):", estimatedPromptTokens);
      console.log(
        "# of Sampled Tokens (generated tokens):",
        estimatedSampledTokens
      );
      const estimatedPromptCost = (estimatedPromptTokens / 1000) * 0.03;
      const estimatedSampledCost = (estimatedSampledTokens / 1000) * 0.06;
      console.log(
        "Cost of Prompt Tokens:",
        "$" + estimatedPromptCost.toFixed(3)
      );
      console.log(
        "Cost of Sampled Tokens:",
        "$" + estimatedSampledCost.toFixed(3)
      );
      console.log(
        "Total Cost to Code:",
        "$" + (estimatedPromptCost + estimatedSampledCost).toFixed(3)
      );
      toast.info(
        toastMessage(
          "Submitting to OpenAI...",
          "$" +
            (estimatedPromptCost + estimatedSampledCost).toFixed(3) +
            " (Prompt: $" +
            estimatedPromptCost.toFixed(3) +
            ", Sampled: $" +
            estimatedSampledCost.toFixed(3) +
            ")"
        )
      );

      // Request to openai chat completion api to get the coded entries.
      const madeCodedEntriesStr = await makeCodedEntries.mutateAsync({
        transactionDescriptions,
        codedEntries,
      });
      if (!madeCodedEntriesStr) return;
      console.log("madeCodedEntriesStr:", madeCodedEntriesStr);
      const madeCodedEntries = JSON.parse(madeCodedEntriesStr) as string[];
      console.log("madeCodedEntries:", madeCodedEntries);

      // Make a "default" account for transactions that don't match any account
      const default_account = accounts.find(
        (account) => account.name === "SUSPENSE"
      ) as Account;

      console.log("filteredTransactions:", filteredTransactions);

      // First get the coded entries for each transaction
      const codedTransactions: CodedTransaction[] = filteredTransactions.map(
        (transaction, i) => {
          const coded_entry = madeCodedEntries[i]?.toUpperCase() || "";
          const account_guesses = makeAccountGuesses(
            coded_entry,
            accounts,
            "levenshtein"
          );

          return {
            ...transaction,
            coded_entry,
            account_guesses,
            selected_account: {
              number:
                account_guesses[0]?.account.number || default_account.number,
              name: account_guesses[0]?.account.name || default_account.name,
            },
          };
        }
      );
      console.log("codedTransactions:", codedTransactions);

      // Map each transaction to a coded transaction
      setCodedTransactions(codedTransactions);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsCoding(false);
    }
  }, [
    generalLedger,
    bankStatements,
    includeDebits,
    includeDeposits,
    selectedStatement,
    makeCodedEntries,
  ]);

  useEffect(() => {
    if (!generalLedger?.name)
      setMessage("You need to upload a general ledger before you can proceed.");
    else if (!bankStatements?.length)
      setMessage(
        "You need to upload at least one bank statement before you can proceed."
      );
    else if (generalLedger.name && !generalLedger.results)
      setMessage(
        "Your general ledger is being processed. Please wait a moment..."
      );
    else if (bankStatements.some((bs) => !bs.results))
      setMessage(
        "One or more of your bank statements are being processed. Please wait a moment..."
      );
    else setMessage("");
  }, [generalLedger, bankStatements]);

  return (
    <div className="mt-2 w-full rounded-md bg-white py-6 pl-6 shadow-md">
      <Header />

      {/* Alert */}
      {message && <Alert message={message} />}

      {/* [Quick Settings] */}
      <div className="my-3 flex h-fit flex-col gap-4 rounded-l-lg bg-stone-200 px-4 py-3 sm:flex-row sm:items-center sm:py-1.5">
        <div className="ml-0.5 flex items-center gap-2">
          <Cog className="h-6 w-6 text-stone-400" />
          {/* <h2 className="text-lg font-medium">Quick Settings</h2> */}
        </div>

        {/* Bank Statement Dropdown */}
        <div className="relative inline-flex w-fit">
          <select
            id="account-select"
            className="block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-stone-500"
            disabled={bankStatements?.length ? false : true}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              bankStatements?.length && setSelectedStatement(e.target.value)
            }
          >
            <option value="">Select Bank Statement...</option>
            {bankStatements?.map((bankStatement) => (
              <option key={bankStatement.hash} value={bankStatement.hash}>
                {bankStatement.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {/* Include Debits Switch */}
        <div
          className="flex items-center gap-2"
          onClick={() => setIncludeDebits((prev) => !prev)}
        >
          <Switch
            checked={includeDebits}
            className={`${
              includeDebits
                ? "border-white bg-stone-700"
                : "border-stone-700 bg-white"
            } relative inline-flex h-6 w-11 items-center rounded-full border`}
          >
            <span className="sr-only">Debits</span>
            <span
              className={`${
                includeDebits
                  ? "translate-x-6 bg-white"
                  : "translate-x-1 bg-stone-700"
              } inline-block h-4 w-4 transform rounded-full`}
            />
          </Switch>
          <label htmlFor="debits-only" className="cursor-pointer font-medium">
            Debits
          </label>
        </div>

        {/* Include Deposits Switch */}
        <div
          className="flex items-center gap-2"
          onClick={() => setIncludeDeposits((prev) => !prev)}
        >
          <Switch
            checked={includeDebits}
            className={`${
              includeDeposits
                ? "border-white bg-stone-700"
                : "border-stone-700 bg-white"
            } relative inline-flex h-6 w-11 items-center rounded-full border`}
          >
            <span className="sr-only">Deposits</span>
            <span
              className={`${
                includeDeposits
                  ? "translate-x-6 bg-white"
                  : "translate-x-1 bg-stone-700"
              } inline-block h-4 w-4 transform rounded-full`}
            />
          </Switch>
          <label htmlFor="deposits-only" className="cursor-pointer font-medium">
            Deposits
          </label>
        </div>
      </div>

      {/* Code Again Button */}
      {codedTransactions.length > 0 && (
        <div className="mt-2 flex h-fit justify-between gap-2 pr-6">
          <div className="flex items-center gap-4">
            {/* Code Button */}
            <button
              className={`flex w-fit items-center rounded px-4 py-2 text-white focus:outline-none ${
                message || !selectedStatement || isCoding
                  ? "cursor-not-allowed bg-stone-300"
                  : "bg-stone-500 hover:bg-stone-600"
              }`}
              disabled={message || !selectedStatement ? true : false}
              onClick={() => {
                void categorizeTransactions();
              }}
            >
              <Wand2
                className={`mr-2 ${isCoding ? "animate-spin" : ""}`}
                size={16}
              />
              {isCoding ? "Coding..." : "Code Again"}
            </button>

            {/* Warning, if transactions are present */}
            {!message && codedTransactions.length > 0 && (
              <div className="text-xs text-gray-500">
                <h3 className="font-medium">Warning!</h3>
                <p>
                  This will overwrite any existing coded transactions below.
                </p>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            className={`flex w-fit items-center rounded px-4 py-2 text-white focus:outline-none ${
              message || !selectedStatement || isCoding
                ? "cursor-not-allowed bg-stone-300"
                : "bg-stone-500 hover:bg-stone-600"
            }`}
            disabled={
              message || !selectedStatement || !codedTransactions ? true : false
            }
            onClick={() => {
              // TODO: export as a macro
            }}
          >
            <Share className="mr-2" size={16} />
            Export Macro
          </button>
        </div>
      )}

      {/* Coded Transactions Table */}
      {!message && (
        <div
          className={`mr-6 ${codedTransactions.length === 0 ? "mb-12" : ""}`}
        >
          <TableCodedTransactions
            isCoding={isCoding}
            codedTransactions={codedTransactions}
            accounts={accounts}
            updateCodedEntry={updateCodedEntry}
            updateSelectedAccount={updateSelectedAccount}
          />

          {/* Code Button */}
          {codedTransactions.length === 0 && (
            <button
              className={`mx-auto mt-2 flex w-fit items-center rounded px-4 py-2 text-white focus:outline-none ${
                message || !selectedStatement || isCoding
                  ? "cursor-not-allowed bg-stone-300"
                  : "bg-stone-500 hover:bg-stone-600"
              }`}
              disabled={message || !selectedStatement ? true : false}
              onClick={() => {
                void categorizeTransactions();
              }}
            >
              <Wand2
                className={`mr-2 ${isCoding ? "animate-spin" : ""}`}
                size={16}
              />
              {isCoding ? "Coding..." : "Code Transactions"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
