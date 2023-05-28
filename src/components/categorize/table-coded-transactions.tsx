import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, CircleOff } from "lucide-react";
import type { Account } from "~/types/account";
import type { CodedTransaction } from "~/types/coded-transaction";
import scanningGif from "../../../public/images/scanning.gif";
import { differenceInMinutes, differenceInSeconds } from "date-fns";
import { ProgressBar } from "../progress-bar";
import { Tooltip } from "react-tooltip";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { classNames } from "~/utils/helpers";

type Props = {
  isCoding: boolean;
  codedTransactions: CodedTransaction[];
  accounts: Account[];
  updateCodedEntry: (index: number, codedEntry: string) => void;
  updateSelectedAccount: (index: number, accountNumber: string) => void;
};

const TableCodedTransactions: React.FC<Props> = ({
  isCoding,
  codedTransactions,
  accounts,
  updateCodedEntry,
  updateSelectedAccount,
}) => {
  // Bulk edit functionality
  const [selectedBulkEditTransactions, setSelectedBulkEditTransactions] =
    useState<number[]>([]);
  const toggleTransactionSelection = (index: number) => {
    setSelectedBulkEditTransactions((prev) => {
      if (prev.includes(index))
        return prev.filter((prevIndex) => prevIndex !== index);
      else return [...prev, index];
    });
  };

  // Bulk edit modal
  const onlyThisOneRef = useRef(null);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [selectedBulkEditAccountNumber, setSelectedBulkEditAccountNumber] =
    useState<string | null>(null);
  const [selectedBulkEditCodedEntry, setSelectedBulkEditCodedEntry] = useState<
    string | null
  >(null);
  const openBulkEditModal = (accountNumber: string, codedEntry: string) => {
    setSelectedBulkEditAccountNumber(accountNumber);
    setSelectedBulkEditCodedEntry(codedEntry);

    // add all indexes with same codedEntry to setSelectedBulkEditTransactions
    const indexes = codedTransactions.reduce((acc, curr, index) => {
      if (curr.coded_entry === codedEntry) acc.push(index);
      return acc;
    }, [] as number[]);
    setSelectedBulkEditTransactions(indexes);

    setIsBulkEditOpen(true);
  };
  const updateAndCloseBulkEditModal = useCallback(() => {
    if (selectedBulkEditAccountNumber) {
      const account = accounts.find(
        (a) => a.number === selectedBulkEditAccountNumber
      );
      if (!account) return;

      // Update all selected transactions
      for (const index of selectedBulkEditTransactions)
        updateSelectedAccount(index, account.number);
    }
    setIsBulkEditOpen(false);
  }, [
    accounts,
    selectedBulkEditAccountNumber,
    selectedBulkEditTransactions,
    updateSelectedAccount,
  ]);

  // Account filter
  const [query, setQuery] = useState("");
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>(accounts);
  useEffect(() => {
    setFilteredAccounts(
      accounts.filter((account) =>
        `${account.number} ${account.name}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    );
  }, [query, accounts]);

  // Progress bar
  const [beganCodingAt, setBeganCodingAt] = useState<Date | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!isCoding) {
      setProgress(1);
      setBeganCodingAt(null);
    } else {
      setProgress(0.05);
      setBeganCodingAt(new Date());
    }
  }, [isCoding]);
  const [timeAgo, setTimeAgo] = useState("");
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diffInMinutes = differenceInMinutes(now, beganCodingAt ?? now);
      const diffInSeconds = differenceInSeconds(now, beganCodingAt ?? now) % 60; // Get the remaining seconds after minutes are subtracted
      let timeAgo = "";

      if (diffInMinutes > 0)
        timeAgo = `${diffInMinutes} minute${
          diffInMinutes > 1 ? "s" : ""
        }, ${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;
      else
        timeAgo = `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;

      setTimeAgo(timeAgo);

      // Add progress
      if (diffInSeconds <= 30 && progress < 0.95)
        setProgress((prevProgress) => prevProgress + 0.031);
    }, 1000);

    return () => clearInterval(timer);
  }, [isCoding, progress, beganCodingAt]);

  return (
    <div className="mt-4 overflow-hidden rounded">
      {codedTransactions.length === 0 ? (
        // If there are no transactions to display, show a message
        <div className="mt-4 flex flex-col items-center justify-center p-4">
          {isCoding ? (
            <Image
              src={scanningGif}
              alt="Scanning"
              width={48}
              height={48}
              className="mb-2"
            />
          ) : (
            <CircleOff className="mb-4 h-12 w-12 text-stone-200" />
          )}
          <p className={`mb-2 text-center ${isCoding ? "" : "text-stone-500"}`}>
            {isCoding
              ? "Please wait while we code your transactions..."
              : "There are currently no coded transactions to display."}
          </p>
          {isCoding && <ProgressBar progress={progress} />}
          {isCoding && (
            <p className="mt-3 text-xs text-gray-500">Started {timeAgo}</p>
          )}
        </div>
      ) : (
        // Otherwise, display the transactions in a table
        <table className="min-w-full table-auto divide-y divide-stone-400 bg-stone-200">
          <thead className="justify-between">
            <tr className="bg-stone-500">
              <th className="py-2 pl-4 pr-2 text-left text-sm font-bold text-white">
                Date
              </th>
              <th className="px-2 py-2 text-left text-sm font-medium text-white">
                Description
              </th>
              <th className="py-2 pl-2 pr-4 text-left text-sm font-medium text-white">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {codedTransactions.map((transaction, index) => (
              <Fragment key={index}>
                {/* Row 1: Transaction Information */}
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-stone-100" : ""}`}
                >
                  <td
                    className="pb-4 pl-4 pr-2 pt-6 text-sm font-bold text-stone-700"
                    style={{ verticalAlign: "top" }}
                  >
                    {transaction.date}
                  </td>
                  <td
                    className="px-2 pb-4 pt-6 text-sm font-medium text-stone-700"
                    style={{ verticalAlign: "top" }}
                  >
                    {transaction.description}
                  </td>
                  <td
                    className="pb-4 pl-2 pr-4 pt-6 font-mono text-sm text-stone-700"
                    style={{ verticalAlign: "top" }}
                  >
                    {transaction.amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      // Use parentheses for negative amounts
                      // and the negative sign for positive amounts
                      // (default is to use the negative sign for both)
                      currencySign: "accounting",
                    })}
                  </td>
                </tr>

                {/* Row 2: Categorization Information */}
                <tr className={`${index % 2 === 0 ? "bg-stone-100" : ""} py-2`}>
                  <td className="pb-2 pt-2 text-sm text-stone-700" colSpan={3}>
                    <div
                      className={`mb-2 flex items-center space-x-4 border-t-2 pt-6 ${
                        index % 2 === 0
                          ? "border-t-stone-200"
                          : "border-t-stone-100"
                      } ${
                        transaction.account_guesses.length > 0 ? "" : "pb-4"
                      }`}
                    >
                      {/* Select an account for the transaction */}
                      <div className="ml-4 flex w-1/3 flex-col">
                        <label
                          htmlFor="account-select"
                          className="mb-2 block font-medium text-gray-700"
                        >
                          Account
                        </label>
                        <div className="relative inline-flex w-full">
                          <Combobox
                            as="div"
                            value={accounts.find(
                              (account) =>
                                account.number ===
                                transaction?.selected_account?.number
                            )}
                            onChange={(account) => {
                              // Look for other transactions with the same coded entry,
                              // and update their selected account as well
                              // To do this:
                              // 1. Find all transactions with the same coded entry
                              // 2. Display a modal, with a table of all the transactions with the same coded entry
                              // 3. Allow the user to deselect the transactions they don't want to update
                              // 4. Have a button to update the selected account for the remaining transactions

                              // 1. Find all transactions with the same coded entry
                              const transactionsWithSameCodedEntry =
                                codedTransactions.filter(
                                  (t) =>
                                    t.coded_entry === transaction.coded_entry
                                );
                              if (transactionsWithSameCodedEntry.length > 1)
                                // 2. Display a modal, with a table of all the transactions with the same coded entry
                                openBulkEditModal(
                                  account.number,
                                  transaction.coded_entry
                                );
                              else updateSelectedAccount(index, account.number);
                            }}
                            className="w-full"
                          >
                            <Combobox.Input
                              id="account-select"
                              className="block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-stone-500"
                              onChange={(e) => setQuery(e.target.value)}
                              onBlur={() => {
                                setQuery("");
                              }}
                              displayValue={(account: Account) =>
                                `${account.number} ${account.name}`
                              }
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r px-2 focus:outline-none focus:ring-0">
                              <ChevronDown className="h-4 w-4" />
                            </Combobox.Button>

                            {accounts.length > 0 && (
                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredAccounts.map((account) => (
                                  <Combobox.Option
                                    key={account.number}
                                    value={account}
                                    className={({ active }) =>
                                      classNames(
                                        "relative cursor-default select-none py-2 pl-3 pr-9",
                                        active
                                          ? "bg-stone-600 text-white"
                                          : "text-gray-900"
                                      )
                                    }
                                  >
                                    {({ active, selected }) => (
                                      <>
                                        <span
                                          className={classNames(
                                            "block truncate",
                                            selected ? "font-semibold" : ""
                                          )}
                                        >
                                          {account.number} {account.name}
                                        </span>

                                        {selected && (
                                          <span
                                            className={classNames(
                                              "absolute inset-y-0 right-0 flex items-center pr-4",
                                              active
                                                ? "text-white"
                                                : "text-stone-600"
                                            )}
                                          >
                                            <Check
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))}
                              </Combobox.Options>
                            )}
                          </Combobox>
                        </div>
                      </div>

                      {/* Enter a coded entry for the transaction */}
                      <div className="flex w-1/3 flex-col">
                        <label
                          htmlFor="coded-entry-input"
                          className="lock mb-2 font-medium text-gray-700"
                        >
                          Coded Entry
                        </label>
                        <input
                          type="text"
                          id="coded-entry-input"
                          className="block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-stone-500"
                          value={transaction.coded_entry || ""}
                          onChange={(e) => {
                            updateCodedEntry(index, e.target.value);
                          }}
                          placeholder="..."
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Row 3: Account Confidence Scores */}
                {transaction.account_guesses.length > 0 && (
                  <tr className={`${index % 2 === 0 ? "bg-stone-100" : ""}`}>
                    <td className="max-w-sm pb-8 pl-4" colSpan={3}>
                      <div className="overflow-x-auto whitespace-nowrap">
                        <div className="inline-grid grid-flow-col gap-4">
                          {transaction.account_guesses.map((accountGuess) => (
                            <Fragment key={accountGuess.account.number}>
                              <div
                                data-tooltip-id="quantity-tooltip"
                                data-tooltip-content={`${
                                  accountGuess.quantity ?? "0"
                                } Matches`}
                                // TODO: also use the same logic for opening the bulk edit modal
                                onClick={() => {
                                  updateSelectedAccount(
                                    index,
                                    accountGuess.account.number
                                  );
                                }}
                                className={`group flex cursor-pointer flex-col items-start justify-between rounded-md border-2 ${
                                  index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                                } px-3 py-2 transition-colors duration-200 hover:shadow-lg ${
                                  transaction.selected_account?.number ===
                                  accountGuess.account.number
                                    ? "border-stone-500 bg-stone-100"
                                    : accountGuess.confidence > 0.7
                                    ? "border-green-500 hover:bg-green-50"
                                    : accountGuess.confidence > 0.4
                                    ? "border-yellow-500 hover:bg-yellow-50"
                                    : "border-red-500 hover:bg-red-50"
                                }`}
                              >
                                <div className="flex w-full items-start justify-between gap-2">
                                  <span className="text-sm font-semibold text-gray-700">
                                    {accountGuess.account.number}
                                  </span>
                                  <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">
                                    {(accountGuess.confidence * 100).toFixed(2)}
                                    %
                                  </span>
                                </div>
                                <span className="text-xs text-gray-800">
                                  {accountGuess.account.name}
                                </span>
                              </div>
                              {accountGuess.quantity && (
                                <Tooltip id="quantity-tooltip" place="bottom" />
                              )}
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}

      {isBulkEditOpen && (
        <Transition.Root show={isBulkEditOpen} as={Fragment}>
          <Dialog
            as="div"
            initialFocus={onlyThisOneRef}
            static
            className="fixed inset-0 z-10 overflow-y-auto"
            open={isBulkEditOpen}
            onClose={setIsBulkEditOpen}
          >
            <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="hidden sm:inline-block sm:h-screen sm:align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6 sm:align-middle">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Update similar transactions with the same coded entry?
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        This will change all transactions with the same coded
                        entry to the same account. <br />
                        <br />{" "}
                        <b>
                          {selectedBulkEditAccountNumber}{" "}
                          {
                            accounts.find(
                              (account) =>
                                account.number === selectedBulkEditAccountNumber
                            )?.name
                          }
                        </b>
                        <span className="ml-1">
                          ({selectedBulkEditCodedEntry})
                        </span>
                      </p>

                      <table>
                        <tbody>
                          {codedTransactions.map(
                            (transaction, i) =>
                              selectedBulkEditTransactions.includes(i) && (
                                <tr key={transaction.id}>
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={true}
                                      onChange={() =>
                                        toggleTransactionSelection(i)
                                      }
                                      className="mr-2"
                                    />
                                  </td>
                                  <td>{transaction.description}</td>
                                </tr>
                              )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mt-5 justify-end sm:mt-4 sm:flex sm:flex-row">
                    <button
                      ref={onlyThisOneRef}
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => {
                        // TODO: add functionailty to update only this one (need to add a new state when ititializing the modal)
                        setIsBulkEditOpen(false);
                      }}
                    >
                      Update Only This One
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={updateAndCloseBulkEditModal}
                    >
                      Update All Selected
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </div>
  );
};

export default TableCodedTransactions;
