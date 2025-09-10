import { useSupabase } from "./useSupabase";

export const useSignIn = () => {
  const { isLoaded, supabase } = useSupabase();

  const signInWithPassword = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  return {
    isLoaded,
    signInWithPassword,
  };
};
