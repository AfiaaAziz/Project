import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import LoadingSpinner from "../components/LoadingSpinner";
import { Camera } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const location = useLocation(); // Get URL params

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      console.error("Auth error:", errorDescription);
      // Redirect back to auth page with error message
      navigate(
        `/auth?error=${encodeURIComponent(
          errorDescription || "Authentication failed"
        )}`
      );
      return;
    }

    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate, location.search]);

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
