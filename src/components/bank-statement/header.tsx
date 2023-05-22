import { useEffect, useState } from "react";
import Link from "next/link";
import type { Parser } from "~/types/misc";

type Props = {
  setParser: (parser: Parser) => void;
};

export default function BankStatementHeader({ setParser }: Props) {
  const [selectedBank, setSelectedBank] = useState<string>(
    "Bank of America (Business)"
  );

  // Sync the parser with the parent component
  useEffect(() => {
    setParser(
      selectedBank === "Bank of America (Business)"
        ? "bofa_business"
        : selectedBank === "Regions (Business)"
        ? "regions_business"
        : selectedBank === "Wells Fargo (Business)"
        ? "wells_fargo_business"
        : "n/a"
    );
  }, [selectedBank, setParser]);

  const bankOptions = [
    "Bank of America (Business)",
    "Regions (Business)",
    "Wells Fargo (Business)",
    // add more bank types here as necessary
  ];

  return (
    <>
      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-900">
        <span className="mr-1 rounded-md bg-gray-200 px-1.5 py-0.5 text-lg">
          2.
        </span>{" "}
        Upload a Bank Statement
      </h1>

      {/* Description */}
      <p className="mt-2 text-sm text-gray-700">
        The bank statement should contain a list of transactions.
      </p>
      <ul role="list" className="ml-6 mt-2 list-disc text-sm text-gray-700">
        <li>
          Files must be in a{" "}
          <span className="inline-flex items-center rounded bg-stone-100 px-1 py-0.5 text-xs font-medium text-stone-800">
            .PDF
          </span>
          ,{" "}
          <span className="inline-flex items-center rounded bg-stone-100 px-1 py-0.5 text-xs font-medium text-stone-800 line-through">
            .XLS
          </span>
          , or{" "}
          <span className="inline-flex items-center rounded bg-stone-100 px-1 py-0.5 text-xs font-medium text-stone-800 line-through">
            .XLSX
          </span>{" "}
          format up to 10 MB
        </li>
        <ul className="ml-6 list-disc">
          <li>
            The{" "}
            <span className="inline-flex items-center rounded bg-stone-100 px-1 py-0.5 text-xs font-medium text-stone-800">
              .PDF
            </span>{" "}
            file format is a paperless document and must be exported directly
            from your bank.{" "}
            <Link
              href="https://www.chase.com/content/dam/chase-ux/documents/personal/mobile-online-banking/paperless_mobile.pdf"
              target="_blank"
              className="font-medium text-indigo-600 underline hover:text-indigo-700"
            >
              Going Paperless With Chase
            </Link>
          </li>
          <li className="line-through">
            <span className="inline-flex items-center rounded bg-stone-100 px-1 py-0.5 text-xs font-medium text-stone-800 line-through">
              .XLS
            </span>{" "}
            and{" "}
            <span className="inline-flex items-center rounded bg-stone-100 px-1 py-0.5 text-xs font-medium text-stone-800 line-through">
              .XLSX
            </span>{" "}
            file formats are{" "}
            <Link
              href="https://www.microsoft.com/en-us/microsoft-365/excel"
              target="_blank"
              className="font-medium text-indigo-600 underline hover:text-indigo-700"
            >
              Excel
            </Link>{" "}
            files and must be exported directly from your bank{" "}
            <Link
              href="https://www.chase.com/content/dam/chaseonline/en/legacy/content/secure/sso/document/cco_account_activity_quick_reference-lores.pdf"
              target="_blank"
              className="font-medium text-indigo-600 underline hover:text-indigo-700"
            >
              Chase Quick Reference Guide
            </Link>
          </li>
        </ul>
      </ul>

      <p className="ml-8 mt-4 text-sm font-medium text-gray-700">
        Select the bank that you are uploading statement(s) for:
      </p>

      {/* Bank options */}
      <div className="mt-2 flex h-fit gap-2 md:ml-8">
        {bankOptions.map((bank) => (
          <button
            key={bank}
            type="button"
            onClick={() => setSelectedBank(bank)}
            className={`inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2 ${
              selectedBank === bank
                ? "bg-stone-500 text-white"
                : "border border-stone-500 text-stone-500"
            }`}
          >
            {bank}
          </button>
        ))}
      </div>
    </>
  );
}
