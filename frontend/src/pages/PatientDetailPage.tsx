import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData, Appointment, MedicalFile } from "@/context/DataContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { CalendarIcon, Clock, Edit, FileText, Plus, Trash, User } from "lucide-react";

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const patientId = parseInt(id || "0");
  const navigate = useNavigate();
  
  const { 
    getPatientById, 
    updatePatient, 
    getAppointmentsForPatient, 
    getFilesForPatient,
    addAppointment,
    deleteAppointment,
    addMedicalFile,
    deleteMedicalFile
  } = useData();
  
  const patient = getPatientById(patientId);
  const appointments = getAppointmentsForPatient(patientId);
  const medicalFiles = getFilesForPatient(patientId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState(patient);
  const [isAddAppointmentDialogOpen, setIsAddAppointmentDialogOpen] = useState(false);
  const [isAddFileDialogOpen, setIsAddFileDialogOpen] = useState(false);
  
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    doctor_id: 1, // Current doctor
    patient_id: patientId,
    date_rdv: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    motif: "",
    statut: "à venir",
    note: ""
  });
  
  // State for new file upload: include actual File
  const [newFile, setNewFile] = useState<{ patient_id: number; nom_fichier: string; file?: File }>({
    patient_id: patientId,
    nom_fichier: "",
    file: undefined
  });
  
  useEffect(() => {
    if (patient) {
      setEditedPatient(patient);
    } else {
      // If patient not found, go back to patients list
      navigate("/patients");
      toast.error("Patient non trouvé");
    }
  }, [patient, navigate]);
  
  if (!patient) {
    return null; // Will redirect in useEffect
  }
  
  const handleSaveEdit = () => {
    if (!editedPatient) return;
    
    updatePatient(patientId, editedPatient);
    setIsEditing(false);
    toast.success("Informations patient mises à jour");
  };
  
  const handleAddAppointment = () => {
    if (!newAppointment.date_rdv || !newAppointment.motif) {
      toast.error("La date et le motif sont obligatoires");
      return;
    }
    
    addAppointment(newAppointment as Omit<Appointment, 'id'>);
    setIsAddAppointmentDialogOpen(false);
    toast.success("Rendez-vous ajouté avec succès");
    
    setNewAppointment({
      doctor_id: 1,
      patient_id: patientId,
      date_rdv: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      motif: "",
      statut: "à venir",
      note: ""
    });
  };
  
  const handleAddFile = () => {
    if (!newFile.nom_fichier || !newFile.file) {
      toast.error("Le nom et le fichier sont obligatoires");
      return;
    }
    
    addMedicalFile({ file: newFile.file!, patient_id: patientId, nom_fichier: newFile.nom_fichier });
    setIsAddFileDialogOpen(false);
    toast.success("Fichier ajouté avec succès");
    
    setNewFile({ patient_id: patientId, nom_fichier: "", file: undefined });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dossier Patient</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/patients")}
          >
            Retour à la liste
          </Button>
          {isEditing ? (
            <Button
              onClick={handleSaveEdit}
              className="bg-medical-primary hover:bg-medical-primary/90"
            >
              Enregistrer
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" /> Modifier
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="h-24 w-24 rounded-full bg-medical-primary/10 flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-medical-primary" />
            </div>
            <CardTitle className="text-center">
              {patient.prenom} {patient.nom}
            </CardTitle>
            {patient.date_naissance && (
              <CardDescription className="text-center">
                Né(e) le {format(new Date(patient.date_naissance), 'dd MMMM yyyy', { locale: fr })}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Téléphone</h4>
              <p>{patient.telephone || "Non spécifié"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
              <p>{patient.email || "Non spécifié"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Adresse</h4>
              <p>{patient.adresse || "Non spécifiée"}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informations Médicales</CardTitle>
            <CardDescription>
              Informations relatives à la santé du patient
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input
                      id="prenom"
                      value={editedPatient?.prenom || ""}
                      onChange={(e) => setEditedPatient({ ...editedPatient, prenom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      value={editedPatient?.nom || ""}
                      onChange={(e) => setEditedPatient({ ...editedPatient, nom: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date_naissance">Date de naissance</Label>
                    <Input
                      id="date_naissance"
                      type="date"
                      value={editedPatient?.date_naissance || ""}
                      onChange={(e) => setEditedPatient({ ...editedPatient, date_naissance: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sexe">Sexe</Label>
                    <select
                      id="sexe"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editedPatient?.sexe || ""}
                      onChange={(e) => setEditedPatient({ ...editedPatient, sexe: e.target.value as "Homme" | "Femme" | "Autre" })}
                    >
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={editedPatient?.telephone || ""}
                    onChange={(e) => setEditedPatient({ ...editedPatient, telephone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedPatient?.email || ""}
                    onChange={(e) => setEditedPatient({ ...editedPatient, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input
                    id="adresse"
                    value={editedPatient?.adresse || ""}
                    onChange={(e) => setEditedPatient({ ...editedPatient, adresse: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={editedPatient?.allergies || ""}
                    onChange={(e) => setEditedPatient({ ...editedPatient, allergies: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maladies_chroniques">Maladies Chroniques</Label>
                  <Textarea
                    id="maladies_chroniques"
                    value={editedPatient?.maladies_chroniques || ""}
                    onChange={(e) => setEditedPatient({ ...editedPatient, maladies_chroniques: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicaments_actuels">Médicaments Actuels</Label>
                  <Textarea
                    id="medicaments_actuels"
                    value={editedPatient?.medicaments_actuels || ""}
                    onChange={(e) => setEditedPatient({ ...editedPatient, medicaments_actuels: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="info">Informations</TabsTrigger>
                  <TabsTrigger value="medical">Dossier médical</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="info">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Sexe</h4>
                        <p>{patient.sexe || "Non spécifié"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Date de naissance</h4>
                        <p>
                          {patient.date_naissance 
                            ? format(new Date(patient.date_naissance), 'dd MMMM yyyy', { locale: fr })
                            : "Non spécifiée"}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="medical">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Allergies</h4>
                      <p>{patient.allergies || "Aucune allergie connue"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Maladies chroniques</h4>
                      <p>{patient.maladies_chroniques || "Aucune maladie chronique connue"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Maladies actuelles</h4>
                      <p>{patient.maladies_actuelles || "Aucune maladie actuelle"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Médicaments actuels</h4>
                      <p>{patient.medicaments_actuels || "Aucun médicament actuel"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Antécédents médicaux</h4>
                      <p>{patient.antecedents_medicaux || "Aucun antécédent"}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="notes">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Notes additionnelles</h4>
                    <p className="mt-1 whitespace-pre-line">
                      {patient.autres_notes || "Aucune note"}
                    </p>
                    {!patient.autres_notes && isEditing && (
                      <div className="mt-4">
                        <Label htmlFor="autres_notes">Ajouter des notes</Label>
                        <Textarea
                          id="autres_notes"
                          value={editedPatient?.autres_notes || ""}
                          onChange={(e) => setEditedPatient({ ...editedPatient, autres_notes: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Rendez-vous</CardTitle>
              <CardDescription>Historique et rendez-vous à venir</CardDescription>
            </div>
            <Button 
              size="sm" 
              onClick={() => setIsAddAppointmentDialogOpen(true)}
              className="bg-medical-primary hover:bg-medical-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" /> Ajouter
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Aucun rendez-vous enregistré
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Motif</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => {
                      const appointmentDate = new Date(appointment.date_rdv);
                      return (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-medical-primary mr-2" />
                              <div>
                                <div>{format(appointmentDate, 'dd/MM/yyyy', { locale: fr })}</div>
                                <div className="text-xs text-muted-foreground">
                                  {format(appointmentDate, 'HH:mm', { locale: fr })}
                                </div>
                              </div>
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
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteAppointment(appointment.id)}
                            >
                              <Trash className="h-4 w-4 text-medical-danger" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Fichiers Médicaux</CardTitle>
              <CardDescription>Documents du patient</CardDescription>
            </div>
            <Button 
              size="sm" 
              onClick={() => setIsAddFileDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Ajouter
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medicalFiles.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Aucun fichier médical
                </p>
              ) : (
                <div className="space-y-2">
                  {medicalFiles.map((file) => (
                    <div 
                      key={file.id} 
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded bg-medical-primary/10 flex items-center justify-center mr-3">
                          <FileText className="h-5 w-5 text-medical-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{file.nom_fichier}</h4>
                          <p className="text-xs text-muted-foreground">
                            Ajouté le {format(new Date(file.date_upload), 'dd/MM/yyyy', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteMedicalFile(file.id)}
                        >
                          <Trash className="h-4 w-4 text-medical-danger" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add Appointment Dialog */}
      <Dialog open={isAddAppointmentDialogOpen} onOpenChange={setIsAddAppointmentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un rendez-vous</DialogTitle>
            <DialogDescription>
              Programmez un nouveau rendez-vous pour ce patient.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date_rdv">Date et heure</Label>
              <Input
                id="date_rdv"
                type="datetime-local"
                value={newAppointment.date_rdv}
                onChange={(e) => setNewAppointment({ ...newAppointment, date_rdv: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motif">Motif</Label>
              <Input
                id="motif"
                value={newAppointment.motif}
                onChange={(e) => setNewAppointment({ ...newAppointment, motif: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (optionnelle)</Label>
              <Textarea
                id="note"
                value={newAppointment.note}
                onChange={(e) => setNewAppointment({ ...newAppointment, note: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAppointmentDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddAppointment} className="bg-medical-primary">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add File Dialog */}
      <Dialog open={isAddFileDialogOpen} onOpenChange={setIsAddFileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un fichier médical</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau document au dossier médical.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom_fichier">Nom du fichier</Label>
              <Input
                id="nom_fichier"
                value={newFile.nom_fichier}
                onChange={(e) => setNewFile({ ...newFile, nom_fichier: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Fichier</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setNewFile({ ...newFile, file: e.target.files?.[0] })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFileDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddFile}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
