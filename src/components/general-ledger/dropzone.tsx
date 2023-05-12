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
import { getSignedUrls, uploadFile } from "~/utils/file";
import { api } from "~/utils/api";
import type { file_details } from "~/types/file";

type Props = { user: User };

export default function Dropzone({ user }: Props) {
  const { supabaseClient: supabase } = useSessionContext();
  const addFileDetails = api.file.addFileDetails.useMutation();

  const [file, setFile] = useState<file_details>();

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
            structure_name: null,
            structure_description: null,
            hash: file_hash,
            owner_id: user.id,
            name: file.name,
            path: "",
            category: "general-ledger",
            // UI:
            isUploading: true,
            hasError: false,
            resourceUrl: "",
            results: null,
          } as file_details;

          // Add the new file to the state
          setFile(newFile);

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
          await addFileDetails.mutateAsync({
            id: file_id,
            size: BigInt(file.size),
            name: file.name,
            hash: file_hash,
            path: uploadedFile.path,
            category: "general-ledger",
          });

          // Mark the file as uploaded
          newFile = {
            ...newFile,
            isUploading: false,
            path: uploadedFile.path,
          };
          console.log("Uploaded file: ", newFile);
          setFile(newFile);
        };
        reader.readAsText(file);
      });
    },
    [addFileDetails, supabase, user.id]
  );

  // Listen for changes to the `file_details` and `file_processor_task` table
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

              //   // Generate URL for the file
              //   const signedUrls = await getSignedUrls([newFile], supabase);

              //   // Add the signed URL to the file
              //   if (signedUrls)
              //     newFile.resourceUrl = signedUrls[0]?.signedUrl ?? "";

              //   // Add the file to the state
              //   setFile(newFile);
              //   break;
              case "UPDATE":
                // Add the UI extension fields to the file
                newFile.isUploading =
                  file?.id == newFile.id && file?.isUploading;
                newFile.hasError = file?.id == newFile.id && file?.hasError;

                // Update the file in the state
                setFile((prev) =>
                  prev?.id == newFile.id ? { ...prev, ...newFile } : prev
                );

                break;
              case "DELETE":
                // Remove the file from the state
                setFile((prev) => (prev?.id == oldFile.id ? undefined : prev));
                break;
            }
          })();
        }
      )
      .subscribe((message) => {
        console.log("Supabase Realtime Status:", message);
      });
  }, [supabase, file]);

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
    open,
  } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    multiple: false,
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
                    <span>Upload a file</span>
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
