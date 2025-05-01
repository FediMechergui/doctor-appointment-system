
import React from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo } from "react";

const UpcomingAppointments = () => {
  const { appointments, patients } = useData();
  
  const upcomingAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.date_rdv);
        return appointmentDate >= today && appointment.statut === 'à venir';
      })
      .slice(0, 5);
  }, [appointments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prochains Rendez-vous</CardTitle>
        <CardDescription>Vos 5 prochains rendez-vous à venir</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Aucun rendez-vous à venir
            </p>
          ) : (
            upcomingAppointments.map((appointment) => {
              const patient = patients.find(p => p.id === appointment.patient_id);
              const appointmentDate = new Date(appointment.date_rdv);
              
              return (
                <div key={appointment.id} className="flex items-center p-3 border rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-medical-primary/10 flex items-center justify-center mr-4">
                    <CalendarIcon className="h-6 w-6 text-medical-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{patient?.prenom} {patient?.nom}</h4>
                    <p className="text-sm text-muted-foreground">{appointment.motif}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{format(appointmentDate, 'HH:mm')}</p>
                    <p className="text-sm text-muted-foreground">{format(appointmentDate, 'dd MMM yyyy', { locale: fr })}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
