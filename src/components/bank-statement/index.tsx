import { useEffect, useState } from "react";
import type { User } from "@supabase/auth-helpers-nextjs";
import Dropzone from "../dropzone";
import Header from "./header";
import FileDisplay from "../file-display";
import type { file_details } from "~/types/file";

type SetStateAction<T> = T | ((prevState: T) => T);
type Dispatch<A> = (value: A) => void;

type Props = {
  user: User;
  setBankStatements: Dispatch<SetStateAction<file_details[]>>;
};

export default function UploadBankStatement({
  user,
  setBankStatements,
}: Props) {
  const [files, setFiles] = useState<file_details[]>([]);

  // Listen for changes to the file object and sync with the parent component
  useEffect(() => {
    setBankStatements(files);
  }, [files, setBankStatements]);

  return (
    <div className="mt-2 w-full rounded-md bg-white p-6 shadow-md">
      <Header />
      <Dropzone kind="bank_statement" user={user} setParentFiles={setFiles} />
      {files.map((file) => (
        <FileDisplay
          file={file}
          setParentFile={(newFile) => {
            setFiles(
              (prev) =>
                prev.map((prevFile) =>
                  prevFile.id === file.id ? newFile : prevFile
                ) as file_details[]
            );
          }}
          key={file.id}
        />
      ))}
    </div>
  );
}
