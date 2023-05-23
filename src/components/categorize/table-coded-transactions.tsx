import { Fragment } from "react";
import Image from "next/image";
import { ChevronDown, CircleOff } from "lucide-react";
import type { Account } from "~/types/account";
import type { CodedTransaction } from "~/types/coded-transaction";
import scanningGif from "../../../public/images/scanning.gif";

type Props = {
  isCoding: boolean;
  codedTransactions: CodedTransaction[];
  accounts: Account[];
};

const TableCodedTransactions: React.FC<Props> = ({
  isCoding,
  codedTransactions,
  accounts,
}) => {
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
          <p className={`text-center ${isCoding ? "" : "text-stone-500"}`}>
            {isCoding
              ? "Please wait while we code your transactions..."
              : "There are currently no coded transactions to display."}
          </p>
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
                          Select an Account
                        </label>
                        <div className="relative inline-flex w-full">
                          <select
                            id="account-select"
                            className="block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-stone-500"
                          >
                            <option value="">...</option>
                            {accounts.map((account) => (
                              <option
                                key={account.number}
                                value={account.number}
                              >
                                {account.number} {account.name}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown className="h-4 w-4" />
                          </div>
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
                          className="block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={transaction.coded_entry || ""}
                          onChange={(e) => {
                            // TODO: Update the transaction's coded entry
                          }}
                          placeholder="..."
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Row 3: Account Confidence Scores */}
                {transaction.account_guesses.length > 0 ?? (
                  <tr className={`${index % 2 === 0 ? "bg-stone-100" : ""}`}>
                    <td className="max-w-sm pb-8 pl-4" colSpan={3}>
                      <div className="overflow-x-auto whitespace-nowrap">
                        <div className="inline-grid grid-flow-col gap-4">
                          {transaction.account_guesses.map(
                            (accountGuess, accIndex) => (
                              <div
                                key={accountGuess.account.number}
                                className={`group flex cursor-pointer flex-col items-start justify-between rounded-md border-2 ${
                                  index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                                } px-3 py-2 transition-colors duration-200 hover:shadow-lg ${
                                  accIndex === 0 // For now only highlight the first guess, but TODO: in the future make this highlight the selected guess.
                                    ? "border-indigo-500 bg-indigo-100"
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
                            )
                          )}
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
    </div>
  );
};

export default TableCodedTransactions;
