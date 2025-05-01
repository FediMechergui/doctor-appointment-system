
import React, { useState } from "react";
import { useData, Patient } from "@/context/DataContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus, Search, Trash, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/components/ui/sonner";

export default function PatientsPage() {
  const { patients, deletePatient, addPatient } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    nom: "",
    prenom: "",
    date_naissance: "",
    sexe: "Homme",
    telephone: "",
    email: "",
    adresse: "",
  });
  const navigate = useNavigate();
  
  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.nom} ${patient.prenom}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });
  
  const handleAddPatient = () => {
    if (!newPatient.nom || !newPatient.prenom) {
      toast.error("Le nom et prénom sont obligatoires");
      return;
    }
    
    addPatient(newPatient as Omit<Patient, 'id'>);
    setNewPatient({
      nom: "",
      prenom: "",
      date_naissance: "",
      sexe: "Homme",
      telephone: "",
      email: "",
      adresse: "",
    });
    setIsAddDialogOpen(false);
    toast.success("Patient ajouté avec succès");
  };
  
  const handleDeletePatient = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
      deletePatient(id);
      toast.success("Patient supprimé avec succès");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Patients</h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)} 
          className="bg-medical-primary hover:bg-medical-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" /> Nouveau Patient
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des Patients</CardTitle>
          <div className="relative mt-2">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Rechercher un patient..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Date de naissance</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Aucun patient trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-medical-primary/10 flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-medical-primary" />
                        </div>
                        {patient.prenom} {patient.nom}
                      </div>
                    </TableCell>
                    <TableCell>
                      {patient.date_naissance 
                        ? format(new Date(patient.date_naissance), 'dd MMMM yyyy', { locale: fr }) 
                        : "-"}
                    </TableCell>
                    <TableCell>{patient.telephone || "-"}</TableCell>
                    <TableCell>{patient.email || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/patients/${patient.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeletePatient(patient.id)}
                          className="text-medical-danger"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau patient</DialogTitle>
            <DialogDescription>
              Remplissez les informations du patient ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={newPatient.prenom}
                  onChange={(e) => setNewPatient({ ...newPatient, prenom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={newPatient.nom}
                  onChange={(e) => setNewPatient({ ...newPatient, nom: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_naissance">Date de naissance</Label>
              <Input
                id="date_naissance"
                type="date"
                value={newPatient.date_naissance}
                onChange={(e) => setNewPatient({ ...newPatient, date_naissance: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={newPatient.telephone}
                onChange={(e) => setNewPatient({ ...newPatient, telephone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                value={newPatient.adresse}
                onChange={(e) => setNewPatient({ ...newPatient, adresse: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button className="bg-medical-primary" onClick={handleAddPatient}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
