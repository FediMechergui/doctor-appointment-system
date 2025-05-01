
import React from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock } from "lucide-react";
import { useMemo } from "react";

const DailySchedule = () => {
  const { appointments, patients } = useData();
  
  const todaysAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.date_rdv);
        return appointmentDate >= today && appointmentDate < tomorrow;
      })
      .sort((a, b) => {
        return new Date(a.date_rdv).getTime() - new Date(b.date_rdv).getTime();
      });
  }, [appointments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendez-vous d'aujourd'hui</CardTitle>
        <CardDescription>Agenda du {format(new Date(), 'dd MMMM yyyy', { locale: fr })}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todaysAppointments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Aucun rendez-vous aujourd'hui
            </p>
          ) : (
            todaysAppointments.map((appointment) => {
              const patient = patients.find(p => p.id === appointment.patient_id);
              const appointmentDate = new Date(appointment.date_rdv);
              
              return (
                <div key={appointment.id} className="flex items-center p-3 border rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-medical-primary/10 flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-medical-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{patient?.prenom} {patient?.nom}</h4>
                    <p className="text-sm text-muted-foreground">{appointment.motif}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{format(appointmentDate, 'HH:mm', { locale: fr })}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className={`
                        px-2 py-1 rounded-full 
                        ${appointment.statut === 'à venir' ? 'bg-blue-100 text-blue-800' : ''}
                        ${appointment.statut === 'terminé' ? 'bg-green-100 text-green-800' : ''}
                        ${appointment.statut === 'annulé' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {appointment.statut}
                      </span>
                    </p>
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

export default DailySchedule;
