
import React from "react";
import CalendarView from "@/components/calendar/CalendarView";
import UpcomingAppointments from "@/components/calendar/UpcomingAppointments";
import DailySchedule from "@/components/calendar/DailySchedule";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Calendrier</h1>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <CalendarView />
        <DailySchedule />
      </div>
      
      <div className="grid gap-6">
        <UpcomingAppointments />
      </div>
    </div>
  );
}
