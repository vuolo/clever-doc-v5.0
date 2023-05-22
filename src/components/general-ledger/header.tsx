import { useEffect, useState } from "react";
import Link from "next/link";
import type { Parser } from "~/types/misc";

type Props = {
  setParser: (parser: Parser) => void;
};

export default function GeneralLedgerHeader({ setParser }: Props) {
  const [selectedAccountingSoftware, setSelectedAccountingSoftware] =
    useState<string>("Accounting CS");

  // Sync the parser with the parent component
  useEffect(() => {
    setParser(
      selectedAccountingSoftware === "Accounting CS"
        ? "accounting_cs"
        : selectedAccountingSoftware === "QuickBooks"
        ? "quickbooks"
        : "n/a"
    );
  }, [selectedAccountingSoftware, setParser]);

  const accountingSoftwareOptions = [
    "Accounting CS",
    "QuickBooks",
    // add more software options here as necessary
  ];

  return (
    <>
      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-900">
        <span className="mr-1 rounded-md bg-gray-200 px-1.5 py-0.5 text-lg">
          1.
        </span>{" "}
        Upload a General Ledger
      </h1>

      {/* Description */}
      <p className="mt-2 text-sm text-gray-700">
        The report should contain a list of accounts and associated entries.
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
            file format is a document and must be exported directly from{" "}
            <Link
              href="https://cs.thomsonreuters.com/ua/acct_pr/csa/cs_us_en/topics/hidd_gl_reportpropsheet_.htm"
              target="_blank"
              className="font-medium text-indigo-600 underline hover:text-indigo-700"
            >
              Accounting CS
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
            files and must be exported directly from{" "}
            <Link
              href="https://quickbooks.intuit.com/learn-support/en-ca/help-article/export-reports/export-reports-excel-workbooks-quickbooks-desktop/L4cLJEeXt_CA_en_CA#:~:text=Export%20a%20report%20in%20QuickBooks%20Desktop%20for%20Mac&text=5%20or%20Microsoft%20Excel%202016,file%20where%20you%20want%20it."
              target="_blank"
              className="font-medium text-indigo-600 underline hover:text-indigo-700"
            >
              QuickBooks
            </Link>
          </li>
        </ul>
      </ul>

      <p className="ml-8 mt-4 text-sm font-medium text-gray-700">
        Select the accounting software that you are uploading general ledger(s)
        from:
      </p>

      {/* Accounting Software options */}
      <div className="mt-2 flex h-fit gap-2 md:ml-8">
        {accountingSoftwareOptions.map((software) => (
          <button
            key={software}
            type="button"
            onClick={() => setSelectedAccountingSoftware(software)}
            className={`inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2 ${
              selectedAccountingSoftware === software
                ? "bg-stone-500 text-white"
                : "border border-stone-500 text-stone-500"
            }`}
          >
            {software}
          </button>
        ))}
      </div>
    </>
  );
}
