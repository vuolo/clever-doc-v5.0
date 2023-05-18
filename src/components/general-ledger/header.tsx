import Link from "next/link";

export default function GeneralLedgerHeader() {
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
    </>
  );
}
