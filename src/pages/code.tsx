import { useState } from "react";
import { type GetServerSidePropsContext, type NextPage } from "next";
import {
  createServerSupabaseClient,
  type User,
} from "@supabase/auth-helpers-nextjs";
import UploadGeneralLedger from "~/components/general-ledger";
import UploadBankStatement from "~/components/bank-statement";
import type { file_details } from "~/types/file";
import Categorize from "~/components/categorize";

type Props = { user: User };

const Code: NextPage<Props> = ({ user }) => {
  const [generalLedger, setGeneralLedger] = useState<file_details>();
  const [bankStatements, setBankStatements] = useState<file_details[]>([]);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <section className="flex h-full min-w-0 flex-1 flex-col gap-6">
        <UploadGeneralLedger user={user} setGeneralLedger={setGeneralLedger} />
        <UploadBankStatement
          user={user}
          setBankStatements={setBankStatements}
        />
        <Categorize
          user={user}
          generalLedger={generalLedger}
          bankStatements={bankStatements}
        />
      </section>
    </div>
  );
};

export default Code;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // TODO: abstract this (into a hook?, look into this)
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session)
    return {
      redirect: {
        destination: `/sign-in?redirectedFrom=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};
