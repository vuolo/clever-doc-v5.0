import { useEffect, useState } from "react";
import type { User } from "@supabase/auth-helpers-nextjs";
import Header from "./header";
import { AlertTriangle } from "lucide-react";
import type { file_details } from "~/types/file";

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

  useEffect(() => {
    if (!generalLedger) {
      setMessage("You need to upload a general ledger before you can proceed.");
    } else if (!bankStatements?.length) {
      setMessage(
        "You need to upload at least one bank statement before you can proceed."
      );
    } else if (!generalLedger.results) {
      setMessage(
        "Your general ledger is being processed. Please wait a moment..."
      );
    } else if (bankStatements.some((bs) => !bs.results)) {
      setMessage(
        "One or more of your bank statements are being processed. Please wait a moment..."
      );
    } else {
      setMessage("");
    }
  }, [generalLedger, bankStatements]);

  return (
    <div className="mt-2 w-full rounded-md bg-white p-6 shadow-md">
      <Header />

      {message && (
        <div className="mt-2 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
