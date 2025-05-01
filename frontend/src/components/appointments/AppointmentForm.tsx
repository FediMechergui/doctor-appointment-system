
import React from "react";
import { useData } from "@/context/DataContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "@/components/ui/sonner";

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentForm = ({ isOpen, onClose }: AppointmentFormProps) => {
  const { patients, addAppointment } = useData();
  const [newAppointment, setNewAppointment] = React.useState({
    doctor_id: 1,
    patient_id: 0,
    date_rdv: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    motif: "",
    statut: "à venir" as "à venir" | "terminé" | "annulé",
    note: ""
  });

  const handleAddAppointment = () => {
    if (newAppointment.patient_id === 0) {
      toast.error("Veuillez sélectionner un patient");
      return;
    }
    
    if (!newAppointment.date_rdv || !newAppointment.motif) {
      toast.error("La date et le motif sont obligatoires");
      return;
    }
    
    addAppointment(newAppointment);
    
    onClose();
    toast.success("Rendez-vous ajouté avec succès");
    
    // Reset form
    setNewAppointment({
      doctor_id: 1,
      patient_id: 0,
      date_rdv: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      motif: "",
      statut: "à venir" as "à venir" | "terminé" | "annulé",
      note: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un rendez-vous</DialogTitle>
          <DialogDescription>
            Programmez un nouveau rendez-vous.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient</Label>
            <Select 
              onValueChange={(value) => setNewAppointment({
                ...newAppointment,
                patient_id: parseInt(value)
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {patient.prenom} {patient.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date_rdv">Date et heure</Label>
            <Input
              id="date_rdv"
              type="datetime-local"
              value={newAppointment.date_rdv}
              onChange={(e) => setNewAppointment({
                ...newAppointment,
                date_rdv: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motif">Motif</Label>
            <Input
              id="motif"
              value={newAppointment.motif}
              onChange={(e) => setNewAppointment({
                ...newAppointment,
                motif: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note (optionnelle)</Label>
            <Textarea
              id="note"
              value={newAppointment.note || ""}
              onChange={(e) => setNewAppointment({
                ...newAppointment,
                note: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="statut">Statut</Label>
            <Select
              defaultValue="à venir"
              onValueChange={(value) => setNewAppointment({
                ...newAppointment,
                statut: value as "à venir" | "terminé" | "annulé"
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="à venir">À venir</SelectItem>
                <SelectItem value="terminé">Terminé</SelectItem>
                <SelectItem value="annulé">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleAddAppointment} className="bg-medical-primary">
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;
