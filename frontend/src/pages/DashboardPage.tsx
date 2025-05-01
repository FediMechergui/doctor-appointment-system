
import React, { useMemo } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, FileText, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function DashboardPage() {
  const { patients, appointments, medicalFiles } = useData();
  
  const todaysAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date_rdv);
      return appointmentDate >= today && appointmentDate < tomorrow;
    });
  }, [appointments]);
  
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

  const appointmentDates = useMemo(() => {
    return appointments.reduce((acc, appointment) => {
      const date = new Date(appointment.date_rdv);
      const dateString = date.toISOString().split('T')[0];
      
      if (!acc[dateString]) {
        acc[dateString] = [];
      }
      
      acc[dateString].push(appointment);
      return acc;
    }, {} as Record<string, typeof appointments>);
  }, [appointments]);

  // Function to add content to calendar tiles
  const handleCalendarDayRender = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const appointmentsForDay = appointmentDates[dateString] || [];
    
    if (appointmentsForDay.length > 0) {
      return (
        <div className="absolute bottom-1 left-0 right-0 flex justify-center">
          <div className="h-1.5 w-1.5 bg-medical-secondary rounded-full"></div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de Bord</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Rendez-vous aujourd'hui" 
          value={todaysAppointments.length.toString()} 
          description="Patients à voir aujourd'hui"
          icon={<Clock className="h-5 w-5 text-medical-primary" />}
        />
        <StatsCard 
          title="Total de patients" 
          value={patients.length.toString()} 
          description="Patients enregistrés"
          icon={<Users className="h-5 w-5 text-medical-secondary" />}
        />
        <StatsCard 
          title="Rendez-vous à venir" 
          value={appointments.filter(a => a.statut === 'à venir').length.toString()} 
          description="Prochains rendez-vous"
          icon={<CalendarIcon className="h-5 w-5 text-medical-accent" />}
        />
        <StatsCard 
          title="Fichiers médicaux" 
          value={medicalFiles.length.toString()} 
          description="Documents stockés"
          icon={<FileText className="h-5 w-5 text-medical-danger" />}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
            <CardDescription>Vue d'ensemble de vos rendez-vous</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="calendar-wrapper relative">
              <Calendar 
                mode="single"
                selected={new Date()}
                className="rounded-md border"
              />
            </div>
          </CardContent>
        </Card>
        
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
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-1">{value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
