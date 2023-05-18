import { Fragment, useCallback, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
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
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { ProgressBar } from "./progress-bar";
import { classNames, getFormattedFileSize } from "~/utils/helpers";
import { api } from "~/utils/api";
import type { file_details } from "~/types/file";
import type { Account } from "~/types/account";

type SetStateAction<T> = T | ((prevState: T) => T);
type Dispatch<A> = (value: A) => void;

type Props = {
  file?: file_details;
  setParentFile?: Dispatch<SetStateAction<file_details | undefined>>;
  setParentFiles?: Dispatch<SetStateAction<file_details[]>>;
};

export default function FileDisplay({
  file,
  setParentFile,
  setParentFiles,
}: Props) {
  const updateFileDetails = api.file.updateFileDetails.useMutation();
  const uploadToFormRecognizer = api.file.uploadToFormRecognizer.useMutation({
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const getResults = useCallback(
    async (resourceUrl: string) => {
      return (await uploadToFormRecognizer.mutateAsync({
        fileUrl: resourceUrl,
        kind: (file?.category as "general_ledger" | "bank_statement") || "n/a",
      })) as Account[];
    },
    [uploadToFormRecognizer, file?.category]
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

  const reparseFile = useCallback(async () => {
    // Process the file
    if (!file?.resourceUrl) return;

    // Reset the file
    if (setParentFile)
      setParentFile((prev) => {
        return {
          ...prev,
          results: undefined,
          beganProcessingAt: new Date(),
        } as file_details;
      });
    else if (setParentFiles)
      setParentFiles((prev) => {
        return prev.map((prevFile) => {
          if (prevFile.id === file.id)
            return {
              ...prevFile,
              results: undefined,
              beganProcessingAt: new Date(),
            } as unknown as file_details;
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
          results,
          beganProcessingAt: undefined,
        } as file_details;
      });
    else if (setParentFiles)
      setParentFiles((prev) => {
        return prev.map((prevFile) => {
          if (prevFile.id === file.id)
            return {
              ...prevFile,
              results,
              beganProcessingAt: undefined,
            } as file_details;
          else return prevFile;
        });
      });

    // Store results in database
    await updateFileDetails.mutateAsync({
      hash: file.hash,
      results,
    });
  }, [
    file?.id,
    file?.resourceUrl,
    file?.hash,
    getResults,
    setParentFile,
    setParentFiles,
    updateFileDetails,
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
      <div className="my-4 rounded-lg border bg-white px-6 py-4">
        <div className="flex justify-between">
          <div className="flex">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-500">
              <FileCheck2 size="24" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                {file?.name}
              </h2>
              <p className="text-xs text-gray-500">
                {getFormattedFileSize(Number(file?.size))}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              data-tooltip-id="reparse-tooltip"
              data-tooltip-content="Reparse File"
              className={classNames(
                "flex h-10 w-10 items-center justify-center rounded-full bg-stone-500 text-white",
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
                "flex h-10 w-10 items-center justify-center rounded-full bg-stone-500 text-white",
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
                        <pre className="max-h-[70vh] overflow-y-auto whitespace-pre rounded bg-gray-100 p-4 text-xs sm:text-sm md:text-base lg:text-lg">
                          {JSON.stringify(file?.results, null, 2)}
                        </pre>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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

        <p className="mt-3 text-sm text-gray-700">
          {file?.structure_name ||
            (file?.category || "")
              .replace("general_ledger", "General Ledger")
              .replace("bank_statement", "Bank Statement")}
        </p>
        {file?.structure_description && (
          <p className="ml-1 flex items-center gap-1 text-xs text-gray-500">
            <CornerDownRight size={12} />
            {file?.structure_description}
          </p>
        )}

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
