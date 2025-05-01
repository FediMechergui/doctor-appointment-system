
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Calendar, 
  Users, 
  FileText, 
  Clock, 
  Settings, 
  Home, 
  FileImage 
} from "lucide-react";

export function SidebarNav() {
  return (
    <div className="w-64 bg-medical-primary text-white flex flex-col h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Med RDV Hub</h2>
      </div>
      
      <div className="flex-1 px-3 py-2">
        <nav className="space-y-1">
          <NavItem href="/" icon={<Home className="h-5 w-5" />} text="Tableau de bord" />
          <NavItem href="/calendar" icon={<Calendar className="h-5 w-5" />} text="Calendrier" />
          <NavItem href="/patients" icon={<Users className="h-5 w-5" />} text="Patients" />
          <NavItem href="/appointments" icon={<Clock className="h-5 w-5" />} text="Rendez-vous" />
          <NavItem href="/files" icon={<FileImage className="h-5 w-5" />} text="Fichiers Médicaux" />
          <NavItem href="/settings" icon={<Settings className="h-5 w-5" />} text="Paramètres" />
        </nav>
      </div>
      
      <div className="p-4 text-xs opacity-70 text-center">
        MED Rendez-vous Hub © 2025
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
}

function NavItem({ href, icon, text }: NavItemProps) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 rounded-lg transition-colors ${
          isActive
            ? "bg-white text-medical-primary font-medium"
            : "text-white hover:bg-white/10"
        }`
      }
    >
      {icon}
      <span className="ml-3">{text}</span>
    </NavLink>
  );
}
