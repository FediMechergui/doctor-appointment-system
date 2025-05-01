
import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AppointmentsList from "@/components/appointments/AppointmentsList";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import AppointmentFilters from "@/components/appointments/AppointmentFilters";

export default function AppointmentsPage() {
  const { appointments, patients } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Apply filters
  const filteredAppointments = appointments.filter(appointment => {
    const patient = patients.find(p => p.id === appointment.patient_id);
    const fullName = patient ? `${patient.prenom} ${patient.nom}`.toLowerCase() : "";
    const motif = appointment.motif ? appointment.motif.toLowerCase() : "";
    
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          motif.includes(searchQuery.toLowerCase());
                          
    const matchesStatus = statusFilter === "all" || appointment.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Rendez-vous</h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)} 
          className="bg-medical-primary hover:bg-medical-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" /> Nouveau Rendez-vous
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des Rendez-vous</CardTitle>
          <CardDescription>Gérez tous vos rendez-vous</CardDescription>
          
          <AppointmentFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </CardHeader>
        <CardContent>
          <AppointmentsList filteredAppointments={filteredAppointments} />
        </CardContent>
      </Card>
      
      <AppointmentForm 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
      />
    </div>
  );
}
