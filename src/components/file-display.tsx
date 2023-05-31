import { Fragment, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { toast } from "react-toastify";
import FileSaver from "file-saver";
import { differenceInSeconds, differenceInMinutes } from "date-fns";
import {
  Braces,
  CornerDownRight,
  Download,
  Eye,
  FileCheck2,
  Loader2,
  Repeat,
  X,
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { ProgressBar } from "./progress-bar";
import {
  classNames,
  getFormattedFileSize,
  toastMessage,
} from "~/utils/helpers";
import { api } from "~/utils/api";
import type { file_details } from "~/types/file";
import type { Account } from "~/types/account";
import type { Parser } from "~/types/misc";
import { getParserImage, getParserName } from "~/utils/parser";

type SetStateAction<T> = T | ((prevState: T) => T);
type Dispatch<A> = (value: A) => void;

type Props = {
  parser: Parser;
  file?: file_details;
  setParentFile?: Dispatch<SetStateAction<file_details | undefined>>;
  setParentFiles?: Dispatch<SetStateAction<file_details[]>>;
};

export default function FileDisplay({
  parser,
  file,
  setParentFile,
  setParentFiles,
}: Props) {
  const updateFileDetails = api.file.updateFileDetails.useMutation();
  const uploadToFormRecognizer = api.file.uploadToFormRecognizer.useMutation({
    onError: (error) => {
      toast.error(
        toastMessage(
          "There was an error processing your file.",
          error.message ?? "Unknown error"
        )
      );
      console.error("Error:", error);
    },
  });

  const getResults = useCallback(
    async (resourceUrl: string) => {
      return (await uploadToFormRecognizer.mutateAsync({
        fileUrl: resourceUrl,
        kind: (file?.category as "general_ledger" | "bank_statement") || "n/a",
        parser,
      })) as Account[];
    },
    [uploadToFormRecognizer, file?.category, parser]
  );

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (file?.results) setProgress(1);
    else setProgress(0.05);
  }, [file?.results]);

  const [timeAgo, setTimeAgo] = useState("");
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diffInMinutes = differenceInMinutes(
        now,
        file?.beganProcessingAt ?? now
      );
      const diffInSeconds =
        differenceInSeconds(now, file?.beganProcessingAt ?? now) % 60; // Get the remaining seconds after minutes are subtracted
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
  }, [file?.beganProcessingAt, progress]);

  // Process the file
  const reparseFile = useCallback(async () => {
    if (!file?.resourceUrl) return;
    const structure_description = parser as string;

    // Reset the file
    if (setParentFile)
      setParentFile((prev) => {
        return {
          ...prev,
          structure_description,
          results: undefined as unknown,
          beganProcessingAt: new Date(),
        } as file_details;
      });
    else if (setParentFiles)
      setParentFiles((prev) => {
        return prev.map((prevFile) => {
          if (prevFile.id === file.id)
            return {
              ...prevFile,
              structure_description,
              results: undefined as unknown,
              beganProcessingAt: new Date(),
            } as file_details;
          else return prevFile;
        });
      });

    console.log("Processing file:", file.resourceUrl);
    const results = await getResults(file.resourceUrl);
    console.log("Results:", results);
    if (setParentFile)
      setParentFile((prev) => {
        return {
          ...prev,
          structure_description,
          results: results || [],
          beganProcessingAt: undefined,
        } as file_details;
      });
    else if (setParentFiles)
      setParentFiles((prev) => {
        return prev.map((prevFile) => {
          if (prevFile.id === file.id)
            return {
              ...prevFile,
              structure_description,
              results: results || [],
              beganProcessingAt: undefined,
            } as file_details;
          else return prevFile;
        });
      });

    // Store results in database
    await updateFileDetails.mutateAsync({
      hash: file.hash,
      structure_description,
      results: results || [],
    });
  }, [
    file?.id,
    file?.resourceUrl,
    file?.hash,
    getResults,
    setParentFile,
    setParentFiles,
    updateFileDetails,
    parser,
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

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
      <div className="mx-4 my-4 rounded-lg border bg-white px-6 py-4 md:mx-auto md:w-[90%]">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex">
            <div className="relative aspect-square h-12 w-12">
              <Image
                src={getParserImage(
                  (file?.structure_description as Parser) ?? parser
                )}
                alt=""
                layout="fill"
                objectFit="cover"
                className="rounded-full border border-black opacity-100"
              />
              {/* <div className="relative h-12 w-12 rounded-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileCheck2 size="24" />
                </div>
              </div> */}
            </div>
            <div className="ml-4 flex flex-col justify-center">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                {file?.name}
              </h2>
              <p className="text-xs text-gray-500">
                {getFormattedFileSize(Number(file?.size))}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              data-tooltip-id="reparse-tooltip"
              data-tooltip-content="Reparse File"
              className={classNames(
                "flex h-10 w-10 items-center justify-center rounded-full bg-stone-500 text-white hover:bg-stone-400",
                !file?.resourceUrl ? "cursor-not-allowed opacity-50" : ""
              )}
              onClick={() => {
                void reparseFile();
              }}
            >
              {file?.resourceUrl ? (
                <Repeat size="16" />
              ) : (
                <Loader2 size="16" className="animate-spin" />
              )}
              <Tooltip id="reparse-tooltip" place="bottom" />
            </button>

            {/* View Results button */}
            <button
              data-tooltip-id="results-tooltip"
              data-tooltip-content="View Results"
              className={classNames(
                "flex h-10 w-10 items-center justify-center rounded-full bg-stone-500 text-white hover:bg-stone-400",
                !file?.results ? "cursor-not-allowed opacity-50" : ""
              )}
              onClick={openModal}
            >
              {file?.results ? (
                <Braces size="16" />
              ) : (
                <Loader2 size="16" className="animate-spin" />
              )}
              <Tooltip id="results-tooltip" place="bottom" />
            </button>

            {/* Modal */}
            <Transition show={isModalOpen} as={Fragment}>
              <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={closeModal}
              >
                <div className="min-h-screen px-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                  </Transition.Child>

                  {/* This element is to trick the browser into centering the modal contents. */}
                  <span
                    className="inline-block h-screen align-middle"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>

                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <div className="my-8 inline-block w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Results
                      </Dialog.Title>
                      <div className="mt-2">
                        <pre className="max-h-[70vh] overflow-y-auto whitespace-pre rounded bg-gray-100 p-4 text-xs">
                          {JSON.stringify(file?.results, null, 2)}
                        </pre>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-stone-500 px-4 py-2 text-sm font-medium text-white hover:bg-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition>

            {/* Vertical Divider */}
            <div className="mx-1 h-10 w-px bg-gray-200" />

            {/* View button */}
            <a
              href={file?.resourceUrl}
              target="_blank"
              rel="noreferrer"
              data-tooltip-id="view-tooltip"
              data-tooltip-content="View File"
              className={classNames(
                "flex h-10 w-10 items-center justify-center rounded-full bg-stone-500 text-white hover:bg-stone-400",
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

            {/* Download button */}
            <button
              data-tooltip-id="download-tooltip"
              data-tooltip-content="Download File"
              className={classNames(
                "flex h-10 w-10 items-center justify-center rounded-full bg-stone-500 text-white hover:bg-stone-400",
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

            {/* Remove Fle button */}
            <button
              data-tooltip-id="remove-tooltip"
              data-tooltip-content="Remove File"
              className="flex h-10 w-10 items-center justify-center rounded-full text-stone-500 hover:text-stone-400"
              onClick={() => {
                if (setParentFile)
                  setParentFile((prev) => {
                    if (prev?.id === file?.id) return undefined;
                    return prev;
                  });
                else if (setParentFiles)
                  setParentFiles((prev) =>
                    prev.filter((f) => f.id !== file?.id)
                  );
              }}
            >
              <X size="16" />
              <Tooltip id="remove-tooltip" place="bottom" />
            </button>
          </div>
        </div>

        <div className="mt-1 flex justify-center md:justify-start">
          <div>
            {/* <p className="mt-3 text-sm text-gray-700">
              {file?.structure_name ||
                (file?.category || "")
                  .replace("general_ledger", "General Ledger")
                  .replace("bank_statement", "Bank Statement")}
            </p> */}
            {file?.structure_description && (
              <p className="ml-5 flex items-center gap-1 text-xs text-gray-500">
                <CornerDownRight size={12} />
                {getParserName(file?.structure_description as Parser)}
              </p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {!file?.results && file?.beganProcessingAt && (
          <div className="mt-2">
            <p className="text-sm">Processing...</p>
            <p className="text-xs text-gray-500">Started {timeAgo}</p>
            <ProgressBar progress={progress} />
          </div>
        )}
      </div>
    </Transition>
  );
}
