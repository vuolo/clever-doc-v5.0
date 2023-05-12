import { useEffect, useState, createContext, useContext } from "react";
import {
  useUser as useSupaUser,
  useSessionContext,
  type User,
} from "@supabase/auth-helpers-react";
import { type user_details } from "@prisma/client";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: user_details | null;
  isLoading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

export const UserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext();
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsloadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<user_details | null>(null);

  const getUserDetails = () =>
    supabase.from("user_details").select("*").limit(1).single();

  useEffect(() => {
    if (user && !isLoadingData && !userDetails) {
      setIsloadingData(true);
      void Promise.allSettled([getUserDetails()]).then((results) => {
        const userDetailsPromise = results[0];

        if (userDetailsPromise.status === "fulfilled")
          setUserDetails(userDetailsPromise.value.data as user_details);

        setIsloadingData(false);
      });
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
    }
  }, [user, isLoadingUser]);

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
