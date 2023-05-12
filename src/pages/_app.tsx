import { useState } from "react";
import { type AppProps } from "next/app";
import {
  type Session,
  SessionContextProvider,
} from "@supabase/auth-helpers-react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { UserContextProvider } from "~/utils/useUser";
import { api } from "../utils/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import Layout from "~/components/layout";
import type { Database } from "~/types/database";

const App = ({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) => {
  // Create a new Supabase browser client on every first render.
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <UserContextProvider>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="light"
            bodyClassName="text-gray-500 text-sm"
            className="w-screen md:w-[375px]"
          />
        </Layout>
      </UserContextProvider>
    </SessionContextProvider>
  );
};

export default api.withTRPC(App);
