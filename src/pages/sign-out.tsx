import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { deleteCookie } from "cookies-next";

import { Loader2 } from "lucide-react";

export default function SignOut() {
  const router = useRouter();
  const { supabaseClient: supabase } = useSessionContext();

  useEffect(() => {
    void (async () => {
      // Sign out using supabase
      await supabase.auth.signOut();

      // Delete the auth token cookie - this is a hack to fix a bug in supabase... (or maybe im doing something wrong. either way, it fixes it)
      const deleteCookieInterval = setInterval(
        () => deleteCookie("supabase-auth-token"),
        100
      );

      // Redirect to home page
      void router
        .replace("/sign-in")
        .then(() => clearInterval(deleteCookieInterval));
    })();
  });

  return (
    <div className="flex h-full w-full items-center justify-center gap-2 pb-[80px] text-gray-400">
      <Loader2 className="animate-spin" />
      <p className="italic">Signing out...</p>
    </div>
  );
}
