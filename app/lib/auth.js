import { supabase } from "./supabaseClient";

export const signUp = async (email , password) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
    return { user, error };
};

export const signIn = async (email , password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    return { user, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { user, error };
};