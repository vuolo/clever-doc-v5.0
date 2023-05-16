import { useState } from "react";
import type { User } from "@supabase/auth-helpers-nextjs";
import Dropzone from "./dropzone";
import Header from "./header";
import FileDisplay from "./file-display";
import type { file_details } from "~/types/file";

type Props = { user: User };

export default function UploadGeneralLedger({ user }: Props) {
  const [file, setFile] = useState<file_details>();

  return (
    <div className="mt-2 w-full rounded-md bg-white p-6 shadow-md">
      <Header />
      <Dropzone user={user} setParentFile={setFile} />
      <FileDisplay file={file} />
    </div>
  );
}
