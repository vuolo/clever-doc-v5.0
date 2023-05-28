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
  setGeneralLedger: Dispatch<SetStateAction<file_details | undefined>>;
};

export default function UploadGeneralLedger({ user, setGeneralLedger }: Props) {
  const [parser, setParser] = useState<Parser>("accounting_cs");
  const [file, setFile] = useState<file_details>();

  // Listen for changes to the file object and sync with the parent component
  useEffect(() => {
    setGeneralLedger(file);
  }, [file, setGeneralLedger]);

  return (
    <div className="mt-2 w-full rounded-md bg-white p-6 shadow-md">
      <Header setParser={setParser} />
      <Dropzone
        kind="general_ledger"
        parser={parser}
        user={user}
        setParentFile={setFile}
      />
      {file?.id && (
        <FileDisplay parser={parser} file={file} setParentFile={setFile} />
      )}
    </div>
  );
}
