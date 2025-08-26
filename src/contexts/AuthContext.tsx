import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: "photographer" | "organizer" | "admin";
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: string
  ) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  updateProfile: (updates: Partial<Profile>) => Promise<any>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // Start true to show loading initially

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleUserProfile = async () => {
      if (user) {
        const existingProfile = await fetchProfile(user.id);

        if (existingProfile) {
          setProfile(existingProfile);
        } else {
          const newProfile = await createProfile(user);
          if (newProfile) {
            setProfile(newProfile);
          }
        }
      }
    };
    if (!loading && user) {
      handleUserProfile();
    } else if (!loading && !user) {
      setProfile(null);
    }
  }, [user, loading]);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  const createProfile = async (
    user: User,
    additionalData: any = {}
  ): Promise<Profile | null> => {
    try {
      const profileData = {
        id: user.id,
        full_name:
          additionalData.full_name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "New User",
        role: additionalData.role || "organizer",
        avatar_url:
          user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      };
      const { data, error } = await supabase
        .from("profiles")
        .insert([profileData])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating profile:", error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });
      if (error) throw error;
      toast.success("Account created! Please check your email to verify.");
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || "Failed to create account.");
      return { data: null, error };
    }
  };
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in.");
      return { data: null, error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google.");
      return { data: null, error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error("No user logged in");
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();
      if (error) throw error;
      setProfile(data);
      toast.success("Profile updated successfully");
      return { data, error: null };
    } catch (error: any) {
      toast.error("Failed to update profile.");
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error && error.message !== "Auth session missing!") {
        throw error;
      }

      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error: any) {
      toast.error("Failed to sign out.");
      console.error("Sign out error:", error);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signOut,
    signIn,
    signUp,
    signInWithGoogle,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
