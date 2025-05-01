
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { SidebarNav } from "./SidebarNav";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { doctor, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen w-full">
      <SidebarNav />
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center justify-between px-6 bg-white">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-lg">MED Rendez-vous Hub</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-4">
              <div className="h-8 w-8 rounded-full bg-medical-primary text-white flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Dr. {doctor?.prenom} {doctor?.nom}</p>
                <p className="text-xs text-muted-foreground">{doctor?.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Déconnexion
            </Button>
          </div>
        </header>
        
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
