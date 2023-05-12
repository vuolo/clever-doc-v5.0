import type { User } from "@supabase/auth-helpers-nextjs";
import Dropzone from "./dropzone";
import Header from "./header";

type Props = { user: User };

export default function UploadGeneralLedger({ user }: Props) {
  return (
    <div className="mt-2 w-full rounded-md bg-white p-6 shadow-md">
      <Header />
      <Dropzone user={user} />
    </div>
  );
}
