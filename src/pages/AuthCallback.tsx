import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import { Camera } from "lucide-react";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          navigate("/auth?error=callback_failed");
          return;
        }

        if (data.session) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.session.user.id)
            .single();

          if (profileError && profileError.code === "PGRST116") {
            const { error: createError } = await supabase
              .from("profiles")
              .insert({
                id: data.session.user.id,
                full_name:
                  data.session.user.user_metadata?.full_name ||
                  data.session.user.user_metadata?.name ||
                  data.session.user.email?.split("@")[0] ||
                  "User",
                avatar_url:
                  data.session.user.user_metadata?.avatar_url ||
                  data.session.user.user_metadata?.picture ||
                  null,
                role: "organizer",
              });

            if (createError) {
              console.error("Error creating profile:", createError);
            }
          }

          navigate("/dashboard");
        } else {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Unexpected error in auth callback:", error);
        navigate("/auth?error=unexpected");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing sign in...
        </h2>
        <p className="text-gray-600">
          Please wait while we set up your account.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
