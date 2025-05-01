
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md text-center">
        <div className="h-20 w-20 bg-medical-primary text-white rounded-full mx-auto flex items-center justify-center mb-6">
          <Stethoscope size={32} />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-medium text-gray-700 mb-6">Page non trouvée</h2>
        <p className="text-gray-500 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-medical-primary hover:bg-medical-primary/90 px-8"
        >
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
}
