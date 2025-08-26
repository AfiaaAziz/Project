// AuthCallback.tsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import LoadingSpinner from "../components/LoadingSpinner";
import { Camera } from "lucide-react";

const AuthCallback: React.FC = () => {
  const { user, loading } = useAuth(); // Get user and loading state from context
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for the authentication process to complete.
    // The onAuthStateChange listener in AuthContext will handle everything.
    if (!loading) {
      if (user) {
        // Once the user is loaded, redirect to the dashboard.
        navigate("/dashboard", { replace: true });
      } else {
        // If for some reason authentication fails, go back to the auth page.
        navigate("/auth", { replace: true });
      }
    }
  }, [user, loading, navigate]); // Rerun effect when user or loading state changes

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