import { useEffect, useState } from "react";
import type { User } from "@supabase/auth-helpers-nextjs";
import Header from "./header";
import { Wand2 } from "lucide-react";
import type { file_details } from "~/types/file";
import TableCodedTransactions from "./table-coded-transactions";
import Alert from "./alert";

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
    // { date: "2023-05-17", description: "Sample Transaction", amount: 100.0 },
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
      {message && <Alert message={message} />}

      {/* Categorize Button */}
      <div className="mt-2">
        <button
          className={`flex items-center rounded px-4 py-2 text-white hover:bg-stone-600 focus:outline-none ${
            message ? "cursor-not-allowed bg-stone-300" : "bg-stone-500"
          }`}
          disabled={message ? true : false}
        >
          <Wand2 className="mr-2" size={16} />
          Categorize
        </button>
      </div>

      {/* Coded Transactions Table */}
      {!message && <TableCodedTransactions transactions={transactions} />}
    </div>
  );
}
