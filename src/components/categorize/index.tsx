import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/auth-helpers-nextjs";
import Header from "./header";
import { ChevronDown, Cog, Wand2 } from "lucide-react";
import TableCodedTransactions from "./table-coded-transactions";
import Alert from "./alert";
import type { file_details } from "~/types/file";
import type { Account } from "~/types/account";
import type { CodedTransaction } from "~/types/coded-transaction";
import type { Transaction } from "~/types/transaction";
import { Switch } from "@headlessui/react";

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
  const [debitsOnly, setDebitsOnly] = useState<boolean>(true);
  const [selectedStatement, setSelectedStatement] = useState<string>("");
  const [isCoding, setIsCoding] = useState<boolean>(false);

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

    // Get the selected bank statement
    const selectedBankStatement = bankStatements.find(
      (bs) => bs.hash === selectedStatement
    );
    if (!selectedBankStatement) return;

    // Get the bank statement transactions
    const transactions = selectedBankStatement.results as Transaction[];

    // Filter transactions based on debitsOnly state
    const filteredTransactions = debitsOnly
      ? transactions.filter((transaction) => transaction.amount < 0)
      : transactions;

    // Clear coded transactions
    setCodedTransactions([]);

    // TODO: remove this when the categorization is actually done
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        setIsCoding(false);
        resolve();
      }, 2000)
    );

    // First get the coded entries for each transaction
    const codedTransactions: CodedTransaction[] = filteredTransactions.map(
      (transaction) => {
        // TODO: Categorize the transaction
        const coded_entry = "";
        const account_guesses = [] as CodedTransaction["account_guesses"];

        return {
          ...transaction,
          coded_entry,
          account_guesses,
          selected_account: {
            number: "999",
            name: "Undistributed",
          },
        };
      }
    );

    // Map each transaction to a coded transaction
    setCodedTransactions(codedTransactions);
  }, [generalLedger, bankStatements, debitsOnly, selectedStatement]);

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

        {/* Debits Only Switch */}
        <div
          className="flex items-center gap-2"
          onClick={() => setDebitsOnly((prev) => !prev)}
        >
          <Switch
            checked={debitsOnly}
            className={`${
              debitsOnly
                ? "border-white bg-stone-700"
                : "border-stone-700 bg-white"
            } relative inline-flex h-6 w-11 items-center rounded-full border`}
          >
            <span className="sr-only">Debits Only</span>
            <span
              className={`${
                debitsOnly
                  ? "translate-x-6 bg-white"
                  : "translate-x-1 bg-stone-700"
              } inline-block h-4 w-4 transform rounded-full`}
            />
          </Switch>
          <label htmlFor="debits-only" className="cursor-pointer font-medium">
            Debits Only
          </label>
        </div>
      </div>

      {/* Code Again Button */}
      {codedTransactions.length > 0 && (
        <div className="mt-2 flex h-fit items-center gap-4 pr-6">
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
              <p>This will overwrite any existing coded transactions below.</p>
            </div>
          )}
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
