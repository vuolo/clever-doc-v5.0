import { useEffect, useState } from "react";
import type { User } from "@supabase/auth-helpers-nextjs";
import Dropzone from "../dropzone";
import Header from "./header";
import FileDisplay from "../file-display";
import type { file_details } from "~/types/file";
import type { Parser } from "~/types/misc";

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
  const [parser, setParser] = useState<Parser>("bofa_business");
  const [files, setFiles] = useState<file_details[]>([]);

  // Listen for changes to the file object and sync with the parent component
  useEffect(() => {
    setBankStatements(files);
  }, [files, setBankStatements]);

  return (
    <div className="mt-2 w-full rounded-md bg-white p-6 shadow-md">
      <Header setParser={setParser} />
      <Dropzone
        kind="bank_statement"
        parser={parser}
        user={user}
        files={files}
        setParentFiles={setFiles}
      />
      {files.map((file) => (
        <FileDisplay
          parser={parser}
          file={file}
          setParentFiles={setFiles}
          key={file.id}
        />
      ))}
    </div>
  );
}
