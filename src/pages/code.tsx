import { type GetServerSidePropsContext, type NextPage } from "next";
import {
  createServerSupabaseClient,
  type User,
} from "@supabase/auth-helpers-nextjs";
import UploadGeneralLedger from "~/components/general-ledger";
import UploadBankStatement from "~/components/bank-statement";

type Props = { user: User };

const Home: NextPage<Props> = ({ user }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <section className="flex h-full min-w-0 flex-1 flex-col gap-6">
        <UploadGeneralLedger user={user} />
        <UploadBankStatement user={user} />
      </section>
    </div>
  );
};

export default Home;

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
