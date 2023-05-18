import { useEffect, useState } from "react";
import type { User } from "@supabase/auth-helpers-nextjs";
import Header from "./header";
import { AlertTriangle, Wand2 } from "lucide-react";
import type { file_details } from "~/types/file";

type Props = {
  user: User;
  generalLedger?: file_details;
  bankStatements?: file_details[];
};

type Transaction = {
  date: string;
  description: string;
  amount: number;
};

export default function Categorize({
  user,
  generalLedger,
  bankStatements,
}: Props) {
  const [message, setMessage] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([
    { date: "2023-05-17", description: "Sample Transaction", amount: 100.0 },
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
    <div className="mt-2 w-full rounded-md bg-white p-6 shadow-md">
      <Header />

      {/* Alert */}
      {message && (
        <div className="mt-2 rounded-md bg-stone-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle
                className="h-5 w-5 text-stone-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-stone-700">{message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Categorize Button */}
      <div className="mt-2">
        <button className="flex items-center rounded bg-stone-500 px-4 py-2 text-white hover:bg-stone-600 focus:outline-none">
          <Wand2 className="mr-2" size={16} />
          Categorize
        </button>
      </div>

      {/* Transactions Table */}
      <div className="mt-4">
        <table className="min-w-full table-auto">
          <thead className="justify-between">
            <tr className="bg-stone-500">
              <th className="px-2 py-2 text-left text-sm font-medium text-white">
                Date
              </th>
              <th className="px-2 py-2 text-left text-sm font-medium text-white">
                Description
              </th>
              <th className="px-2 py-2 text-left text-sm font-medium text-white">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-stone-200">
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td className="px-2 py-2 text-sm text-stone-700">
                  {transaction.date}
                </td>
                <td className="px-2 py-2 text-sm text-stone-700">
                  {transaction.description}
                </td>
                <td className="px-2 py-2 text-sm text-stone-700">
                  {transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
