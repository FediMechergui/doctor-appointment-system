
import React from "react";
import { useData } from "@/context/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Trash, User, XCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/components/ui/sonner";
import { Appointment } from "@/context/DataContext";

interface AppointmentsListProps {
  filteredAppointments: Appointment[];
}

const AppointmentsList = ({ filteredAppointments }: AppointmentsListProps) => {
  const { patients, updateAppointment, deleteAppointment } = useData();

  const handleDeleteAppointment = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) {
      deleteAppointment(id);
      toast.success("Rendez-vous supprimé avec succès");
    }
  };
  
  const handleStatusChange = (id: number, status: "à venir" | "terminé" | "annulé") => {
    updateAppointment(id, { statut: status });
    
    const statusMessages = {
      "à venir": "Rendez-vous marqué comme à venir",
      "terminé": "Rendez-vous marqué comme terminé",
      "annulé": "Rendez-vous marqué comme annulé"
    };
    
    toast.success(statusMessages[status]);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Motif</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAppointments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              Aucun rendez-vous trouvé
            </TableCell>
          </TableRow>
        ) : (
          filteredAppointments.map((appointment) => {
            const patient = patients.find(p => p.id === appointment.patient_id);
            const appointmentDate = new Date(appointment.date_rdv);
            
            return (
              <TableRow key={appointment.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-medical-primary/10 flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-medical-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{patient?.prenom} {patient?.nom}</p>
                      {patient?.telephone && (
                        <p className="text-xs text-muted-foreground">{patient.telephone}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{format(appointmentDate, 'dd MMMM yyyy', { locale: fr })}</p>
                    <p className="text-sm text-muted-foreground">{format(appointmentDate, 'HH:mm', { locale: fr })}</p>
                  </div>
                </TableCell>
                <TableCell>{appointment.motif}</TableCell>
                <TableCell>
                  <span className={`
                    px-2 py-1 rounded-full text-xs
                    ${appointment.statut === 'à venir' ? 'bg-blue-100 text-blue-800' : ''}
                    ${appointment.statut === 'terminé' ? 'bg-green-100 text-green-800' : ''}
                    ${appointment.statut === 'annulé' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {appointment.statut}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {appointment.statut !== 'terminé' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-700"
                        onClick={() => handleStatusChange(appointment.id, "terminé")}
                        title="Marquer comme terminé"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                    {appointment.statut !== 'annulé' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-700"
                        onClick={() => handleStatusChange(appointment.id, "annulé")}
                        title="Marquer comme annulé"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {appointment.statut === 'annulé' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-700"
                        onClick={() => handleStatusChange(appointment.id, "à venir")}
                        title="Marquer comme à venir"
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-medical-danger"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

export default AppointmentsList;
