
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { useMemo } from "react";

const CalendarView = () => {
  const { appointments } = useData();

  // Process appointments to create a mapping of dates to appointments
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
  );
};

export default CalendarView;
