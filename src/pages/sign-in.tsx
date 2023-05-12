import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { useSessionContext, useUser } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function SignIn() {
  const router = useRouter();
  const user = useUser();
  const { supabaseClient: supabase } = useSessionContext();

  // Dynamically return the URL of the current page, and use the redirectedFrom query param to redirect back to the page
  // Example URL: http://localhost:3000/sign-in?redirectedFrom=%2Fdog%2Fdoggydog
  const getURL = useCallback(() => {
    // If we're on the server, return
    if (typeof window === "undefined") return;

    // Get the redirectedFrom query param
    const url = new URL(window.location.href);
    const redirectedFrom = url.searchParams.get("redirectedFrom");

    // Make the URL to redirect to
    const { protocol, host, pathname } = window.location;
    const urlToRedirectTo = `${protocol}//${host}${redirectedFrom ?? pathname}`;

    return urlToRedirectTo;
  }, [router]);

  // If the user is already signed in, redirect them to the home page
  useEffect(() => {
    if (user) void router.replace("/");
  }, [user, router]);

  return (
    <div className="height-screen-helper flex justify-center">
      <div className="m-auto flex w-80 max-w-lg flex-col justify-between p-3 ">
        <div className="flex items-center justify-center gap-2 pb-12 ">
          <Image
            className="h-8 w-auto"
            src="/images/branding/logo/Logo.png"
            width={64}
            height={64}
            alt="Clever Doc"
          />
          <h1 className="font-medium">Clever Doc</h1>
        </div>
        <div className="flex flex-col space-y-4">
          <Auth
            providers={[]}
            supabaseClient={supabase}
            redirectTo={getURL()}
            magicLink={true}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    // indigo:
                    // brand: "#4f46e5",
                    // brandAccent: "#4338ca",
                    // stone:
                    brand: "#57534e",
                    brandAccent: "#44403c",
                  },
                },
              },
              className: {
                label: "default-font",
                input: "default-font",
                button: "default-font",
                anchor: "default-font",
                message: "default-font",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
