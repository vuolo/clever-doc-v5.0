import { Tooltip } from "react-tooltip";
import FileSaver from "file-saver";
import {
  Braces,
  Download,
  Eye,
  FileCheck2,
  Loader2,
  Repeat,
} from "lucide-react";
import { Transition } from "@headlessui/react";
import { classNames, getFormattedFileSize } from "~/utils/helpers";
import type { file_details } from "~/types/file";

type Props = { file?: file_details };

export default function FileDisplay({ file }: Props) {
  return (
    <Transition
      show={!!file}
      enter="transition-opacity transform duration-500"
      enterFrom="opacity-0 -translate-x-10"
      enterTo="opacity-100 translate-x-0"
      leave="transition-opacity transform duration-200"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 -translate-x-10"
    >
      <div className="my-8 flex justify-between rounded-lg border bg-white p-6">
        <div className="flex">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-500">
            <FileCheck2 size="24" />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              {file?.name}
            </h2>
            <p className="text-sm text-gray-500">{file?.structure_name}</p>
            <p className="text-sm text-gray-700">
              {file?.structure_description}
            </p>
            <p className="text-sm text-gray-700">
              {getFormattedFileSize(Number(file?.size))}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            data-tooltip-id="reparse-tooltip"
            data-tooltip-content="Reparse File"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-500 text-white"
            onClick={() => {
              /* Reparse file */
            }}
          >
            <Repeat size="16" />
            <Tooltip id="reparse-tooltip" place="bottom" />
          </button>

          <button
            data-tooltip-id="results-tooltip"
            data-tooltip-content="View Results"
            className={classNames(
              "flex h-10 w-10 items-center justify-center rounded-full bg-stone-500 text-white",
              !file?.results ? "cursor-not-allowed opacity-50" : ""
            )}
            onClick={() => {
              /* Reparse file */
            }}
          >
            {file?.results ? (
              <Braces size="16" />
            ) : (
              <Loader2 size="16" className="animate-spin" />
            )}
            <Tooltip id="results-tooltip" place="bottom" />
          </button>

          {/* Vertical Divider */}
          <div className="mx-2 h-10 w-px bg-gray-200" />

          <a
            href={file?.resourceUrl}
            target="_blank"
            rel="noreferrer"
            data-tooltip-id="view-tooltip"
            data-tooltip-content="View File"
            className={classNames(
              "flex h-10 w-10 items-center justify-center rounded-full bg-stone-500 text-white",
              !file?.resourceUrl ? "cursor-not-allowed opacity-50" : ""
            )}
          >
            {file?.resourceUrl ? (
              <Eye size="16" />
            ) : (
              <Loader2 size="16" className="animate-spin" />
            )}
            <Tooltip id="view-tooltip" place="bottom" />
          </a>
          <button
            data-tooltip-id="download-tooltip"
            data-tooltip-content="Download File"
            className={classNames(
              "flex h-10 w-10 items-center justify-center rounded-full bg-stone-500 text-white",
              !file?.resourceUrl ? "cursor-not-allowed opacity-50" : ""
            )}
            onClick={() => {
              FileSaver.saveAs(file?.resourceUrl ?? "", file?.name);
            }}
          >
            {file?.resourceUrl ? (
              <Download size="16" />
            ) : (
              <Loader2 size="16" className="animate-spin" />
            )}
            <Tooltip id="download-tooltip" place="bottom" />
          </button>
        </div>
      </div>
    </Transition>
  );
}
