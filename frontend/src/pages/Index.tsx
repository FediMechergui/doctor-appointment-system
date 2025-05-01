
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Don't redirect while authentication is being checked
    if (isLoading) return;
    
    // Redirect to dashboard or login based on authentication
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, isLoading]);

  // Show loading spinner while either checking auth or redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-medical-primary border-t-transparent rounded-full"></div>
    </div>
  );
};

export default Index;
