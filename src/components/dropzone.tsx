import {
  type CSSProperties,
  useCallback,
  useMemo,
  useEffect,
  useState,
} from "react";
import { v4 as uuid, v5 as uuidFromString } from "uuid";
import { type FileRejection, useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import type { User } from "@supabase/auth-helpers-nextjs";
import { useSessionContext } from "@supabase/auth-helpers-react";
import {
  dropzoneStyles,
  getUniqueFileName,
  toastMessage,
} from "~/utils/helpers";
import { FilePlus2 } from "lucide-react";
import { getFileByHash, getSignedUrls, uploadFile } from "~/utils/file";
import { api } from "~/utils/api";
import type { file_details } from "~/types/file";
import type { Account } from "~/types/account";

type Props = {
  kind: "general_ledger" | "bank_statement";
  user: User;
  setParentFile?: (file?: file_details) => void;
  setParentFiles?: (files: file_details[]) => void;
};

export default function Dropzone({
  kind,
  user,
  setParentFile,
  setParentFiles,
}: Props) {
  const { supabaseClient: supabase } = useSessionContext();
  const addFileDetails = api.file.addFileDetails.useMutation();
  const updateFileDetails = api.file.updateFileDetails.useMutation();

  const [file, setFile] = useState<file_details>();
  const [files, setFiles] = useState<file_details[]>([]);

  // Listen for changes to the file/files object and sync with the parent component
  useEffect(() => {
    if (setParentFile) setParentFile({ ...file } as file_details);
    else if (setParentFiles) setParentFiles([...files] as file_details[]);
  }, [file, setParentFile, files, setParentFiles, supabase]);

  const uploadToFormRecognizer = api.file.uploadToFormRecognizer.useMutation({
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const getResults = useCallback(
    async (resourceUrl: string) => {
      return (await uploadToFormRecognizer.mutateAsync({
        fileUrl: resourceUrl,
        kind,
      })) as Account[];
    },
    [uploadToFormRecognizer, kind]
  );

  // Uploads files to supabase and creates the `file_details` record
  const uploadFiles = useCallback(
    (files: File[]) => {
      files.forEach((file) => {
        console.log("Uploading file: ", file);

        // Read the file contents
        const reader = new FileReader();
        reader.onload = async (e) => {
          // Generate a hash (as uuid)
          const file_contents = e.target?.result as string;
          const file_hash = uuidFromString(file_contents, uuidFromString.URL);
          const file_id = uuid();

          // Create a sample file object before uploading, then update them once we get the file details back from the server
          let newFile = {
            id: file_id,
            created_at: new Date(),
            updated_at: new Date(),
            size: BigInt(file.size),
            structure_name:
              kind === "bank_statement"
                ? "Bank Statement"
                : kind === "general_ledger"
                ? "General Ledger"
                : null,
            structure_description:
              kind === "bank_statement"
                ? "Bank of America (Business)" // TODO: Make this dynamic
                : kind === "general_ledger"
                ? "Accounting CS" // TODO: Make this dynamic
                : null,
            hash: file_hash,
            owner_id: user.id,
            name: file.name,
            path: "",
            category: kind,
            // UI:
            isUploading: true,
            hasError: false,
            resourceUrl: "",
            results: null,
          } as file_details;

          // Add the new file to the state
          if (setParentFile) setFile({ ...newFile });
          else if (setParentFiles)
            setFiles(
              // don't add the file if the hash already exists
              (prev) =>
                prev.some((file) => file.hash === newFile.hash)
                  ? [...prev]
                  : [...prev, newFile]
            );

          // Check if a file with the same file_hash already exists
          const { data: existingFile, error: existingFileError } =
            await getFileByHash(file_hash, supabase);

          // Existing file found
          if (existingFile && !existingFileError) {
            // If a file with the same hash exists, update the file details and return
            console.log("Found existing file:", existingFile);

            // Generate URL for the file
            console.log("Generating signed URL for file:", existingFile);
            const signedUrls = await getSignedUrls([existingFile], supabase);
            const resourceUrl = signedUrls?.[0]?.signedUrl;
            console.log("Signed URL:", resourceUrl);

            // Mark the file as uploaded, and update details
            newFile = {
              ...newFile,
              ...existingFile,
              isUploading: false,
              path: existingFile.path,
              resourceUrl: resourceUrl ?? "",
              beganProcessingAt: new Date(),
            };

            // Update the file state
            if (setParentFile) setFile({ ...newFile });
            else if (setParentFiles)
              setFiles((prev) =>
                prev.map((file) =>
                  file.hash == newFile.hash ? { ...newFile } : { ...file }
                )
              );

            // Check if there are file.results, and if not, process the file
            if (!existingFile.results) {
              // Process the file
              if (!resourceUrl) return;
              console.log("Processing file:", resourceUrl);
              const results = await getResults(resourceUrl);
              console.log("Results:", results);
              if (setParentFile)
                setFile((prev) =>
                  prev?.id == newFile.id
                    ? { ...prev, results, beganProcessingAt: undefined }
                    : ({ ...prev } as file_details)
                );
              else if (setParentFiles)
                setFiles((prev) =>
                  prev.map((file) =>
                    file.id == newFile.id
                      ? { ...file, results, beganProcessingAt: undefined }
                      : ({ ...file } as file_details)
                  )
                );

              // Store results in database
              await updateFileDetails.mutateAsync({
                hash: existingFile.hash,
                results,
              });
            }
          }
          // No existing file found
          else {
            // Store the file in a bucket using supabase storage
            const fileName = getUniqueFileName(file.name, file_id);
            const filePath = `${user.id}/${fileName}`;
            const { data: uploadedFile, error: uploadError } = await uploadFile(
              file,
              filePath,
              supabase
            );
            if (uploadError) {
              toast.error(
                toastMessage("Error uploading file.", "Please try again later.")
              );
              return;
            }

            // Upload the file details
            const addedFile = await addFileDetails.mutateAsync({
              id: file_id,
              size: BigInt(file.size),
              name: file.name,
              hash: file_hash,
              path: uploadedFile.path,
              structure_name: newFile.structure_name || undefined,
              structure_description: newFile.structure_description || undefined,
              category: kind,
            });
            console.log("Uploaded file:", newFile);
            // console.log("Added file:", addedFile);

            // Mark the file as uploaded
            newFile = {
              ...newFile,
              ...addedFile,
              isUploading: false,
              path: uploadedFile.path,
            };

            // Update the file state
            if (setParentFile) setFile(newFile);
            else if (setParentFiles)
              setFiles((prev) =>
                prev.map((file) =>
                  file.hash == newFile.hash ? { ...newFile } : { ...file }
                )
              );

            // Generate URL for the file
            console.log("Generating signed URL for file:", newFile);
            const signedUrls = await getSignedUrls([newFile], supabase);
            const resourceUrl = signedUrls?.[0]?.signedUrl;
            console.log("Signed URL:", resourceUrl);

            // Add the signed URL to the file
            newFile.resourceUrl = resourceUrl ?? "";

            // Update the file in the state
            if (setParentFile)
              setFile((prev) =>
                prev?.id == newFile.id
                  ? { ...prev, ...newFile, beganProcessingAt: new Date() }
                  : ({ ...prev } as file_details)
              );
            else if (setParentFiles)
              setFiles((prev) =>
                prev.map((file) =>
                  file.hash == newFile.hash
                    ? { ...file, ...newFile, beganProcessingAt: new Date() }
                    : { ...file }
                )
              );

            // Check if there are file.results, and if not, process the file
            if (newFile.results) return;

            // Process the file
            if (!resourceUrl) return;
            console.log("Processing file:", resourceUrl);
            const results = await getResults(resourceUrl);
            console.log("Results:", results);
            if (setParentFile)
              setFile((prev) =>
                prev?.id == newFile.id
                  ? { ...prev, results, beganProcessingAt: undefined }
                  : ({ ...prev } as file_details)
              );
            else if (setParentFiles)
              setFiles((prev) =>
                prev.map((file) =>
                  file.id == newFile.id
                    ? { ...file, results, beganProcessingAt: undefined }
                    : ({ ...file } as file_details)
                )
              );

            // Store results in database
            await updateFileDetails.mutateAsync({
              hash: newFile.hash,
              results,
            });
          }
        };
        reader.readAsText(file);
      });
    },
    [
      addFileDetails,
      updateFileDetails,
      supabase,
      user.id,
      getResults,
      kind,
      setParentFile,
      setParentFiles,
    ]
  );

  // Listen for changes to the `file_details` table
  useEffect(() => {
    supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "file_details",
        },
        (payload) => {
          void (() => {
            // void (async () => {
            console.log("file_details payload", payload);
            const oldFile = payload.old as file_details;
            const newFile = payload.new as file_details;

            switch (payload.eventType) {
              // case "INSERT":
              //   // Add the UI extension fields to the file
              //   newFile.isUploading = false;
              //   newFile.hasError = false;

              //   // Ensure the file is the one we're tracking
              //   if (file?.id != newFile.id) break;

              //   // Generate URL for the file
              //   console.log("Generating signed URL for file:", newFile);
              //   const signedUrls = await getSignedUrls([file], supabase);
              //   const resourceUrl = signedUrls?.[0]?.signedUrl;
              //   console.log("Signed URL:", resourceUrl);

              //   // Add the signed URL to the file
              //   newFile.resourceUrl = resourceUrl ?? "";

              //   // Update the file in the state
              //   setFile((prev) =>
              //     prev?.id == newFile.id
              //       ? { ...prev, ...newFile, beganProcessingAt: new Date() }
              //       : prev
              //   );

              //   // Check if there are file.results, and if not, process the file
              //   if (newFile.results) break;

              //   // Process the file
              //   if (!resourceUrl) break;
              //   console.log("Processing file:", resourceUrl);
              //   const results = await getResults(resourceUrl);
              //   console.log("Results:", results);
              //   setFile((prev) =>
              //     prev?.id == newFile.id
              //       ? { ...prev, results, beganProcessingAt: undefined }
              //       : prev
              //   );

              //   // Store results in database
              //   await updateFileDetails.mutateAsync({
              //     hash: newFile.hash,
              //     results,
              //   });
              //   break;
              case "UPDATE":
                // Add the UI extension fields to the file
                newFile.isUploading =
                  file?.id == newFile.id && file?.isUploading;
                newFile.hasError = file?.id == newFile.id && file?.hasError;

                // Update the file in the state
                if (setParentFile)
                  setFile((prev) =>
                    prev?.hash == newFile.hash
                      ? { ...prev, ...newFile }
                      : ({ ...prev } as file_details)
                  );
                else if (setParentFiles)
                  setFiles((prev) =>
                    prev.map((file) =>
                      file.hash == newFile.hash
                        ? { ...file, ...newFile }
                        : ({ ...file } as file_details)
                    )
                  );

                break;
              case "DELETE":
                // Remove the file from the state
                if (setParentFile)
                  setFile((prev) =>
                    prev?.id == oldFile.id
                      ? undefined
                      : ({ ...prev } as file_details)
                  );
                else if (setParentFiles)
                  setFiles((prev) =>
                    prev.filter((file) => file.id != oldFile.id)
                  );
                break;
            }
          })();
        }
      )
      .subscribe((message) => {
        console.log("Supabase Realtime Status:", message);
      });
  }, [
    supabase,
    file,
    getResults,
    setParentFile,
    setParentFiles,
    // updateFileDetails
  ]);

  // Functionality for managing the file upload
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      uploadFiles(acceptedFiles);

      // Keep only fileRejections with unique error codes. This is to prevent duplicate toasts.
      const uniqueFileRejections = fileRejections.filter(
        (file, index) =>
          fileRejections.findIndex(
            (f) => f.errors[0]?.code === file.errors[0]?.code
          ) === index
      );

      // Display the file rejections to the user
      uniqueFileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === "file-too-large")
            toast.error(
              toastMessage(
                "File too large.",
                "Please upload a file less than 10 MB."
              )
            );
          else if (err.code === "file-invalid-type")
            toast.error(
              toastMessage(
                "File type not supported.",
                "Please upload a PDF, Excel, or CSV file."
              )
            );
          else if (err.code === "too-many-files")
            toast.error(
              toastMessage(
                "Too many files.",
                "Please upload no more than 20 files at a time."
              )
            );
          else toast.error(err.message);
        });
      });
    },
    [uploadFiles]
  );

  // Initialize the file dropzone
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    // open,
  } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    multiple: kind === "bank_statement",
    minSize: 0,
    maxSize: 10485760, // 10 MB
    maxFiles: 20,
    onDrop,
  });

  // Style the file dropzone dynamically
  const dropzoneStyle: CSSProperties = useMemo(
    () => ({
      ...(isFocused ? dropzoneStyles.focused : {}),
      ...(isDragAccept ? dropzoneStyles.accept : {}),
      ...(isDragReject ? dropzoneStyles.reject : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <form className="space-y-8 divide-y divide-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
          <div className="sm:col-span-6">
            {/* Border */}
            <div
              {...getRootProps({ style: dropzoneStyle })}
              className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-12 pt-10 focus:ring-0"
            >
              {/* Mandatory for file dropzone input */}
              <input {...getInputProps()} />

              {/* Contents */}
              <div className="space-y-1 text-center">
                <FilePlus2 size={32} className="mx-auto text-gray-400" />
                <div className="flex justify-center text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-transparent font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>
                      Upload {kind === "general_ledger" ? "a file" : "file(s)"}
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1"> or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  .PDF, <span className="line-through">.XLS, or .XLSX</span> up
                  to 10 MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
