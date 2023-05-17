import Link from "next/link";

export default function GeneralLedgerHeader() {
  return (
    <>
      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-900">
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
    </>
  );
}
