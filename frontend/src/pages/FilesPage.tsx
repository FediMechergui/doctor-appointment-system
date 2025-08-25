import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, FileText, Trash, FileImage, FileVideo, FilePen, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/components/ui/sonner";
import { MedicalFile } from "@/context/DataContext";

export default function FilesPage() {
  const { medicalFiles, patients, addMedicalFile, deleteMedicalFile } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [patientFilter, setPatientFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<MedicalFile | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewError, setPreviewError] = useState<string>("");
  const [newFile, setNewFile] = useState({
    patient_id: 0,
    nom_fichier: "",
    chemin_fichier: "",
    type_fichier: "",
    file: undefined as File | undefined
  });
  
  // Filter files
  const filteredFiles = medicalFiles.filter(file => {
    const patient = patients.find(p => p.id === file.patient_id);
    const fullName = patient ? `${patient.prenom} ${patient.nom}`.toLowerCase() : "";
    const fileName = file.nom_fichier.toLowerCase();
    
    const matchesSearch = fileName.includes(searchQuery.toLowerCase()) || 
                          fullName.includes(searchQuery.toLowerCase());
    
    const matchesPatient = patientFilter === "all" || file.patient_id === parseInt(patientFilter);
    
    return matchesSearch && matchesPatient;
  });
  
  const handleAddFile = () => {
    if (newFile.patient_id === 0) {
      toast.error("Veuillez sélectionner un patient");
      return;
    }
    if (!newFile.file) {
      toast.error("Veuillez sélectionner un fichier à uploader");
      return;
    }
    try {
      addMedicalFile({ file: newFile.file, patient_id: newFile.patient_id, nom_fichier: newFile.nom_fichier });
      setIsAddDialogOpen(false);
      toast.success("Fichier ajouté avec succès");
      setNewFile({
        patient_id: 0,
        nom_fichier: "",
        chemin_fichier: "",
        type_fichier: "",
        file: undefined
      });
    } catch (error) {
      toast.error("Erreur lors de l'ajout du fichier. Veuillez réessayer.");
    }
  };

  
  const handleDeleteFile = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) {
      deleteMedicalFile(id);
      toast.success("Fichier supprimé avec succès");
    }
  };
  
  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="h-6 w-6" />;
    
    if (fileType.includes('image')) {
      return <FileImage className="h-6 w-6" />;
    } else if (fileType.includes('video')) {
      return <FileVideo className="h-6 w-6" />;
    } else if (fileType.includes('pdf')) {
      return <FilePen className="h-6 w-6" />;
    }
    
    return <FileText className="h-6 w-6" />;
  };

  const handlePreviewFile = (file: MedicalFile) => {
    setPreviewError("");
    setPreviewFile(file);
    setIsPreviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fichiers Médicaux</h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)} 
          className="bg-medical-primary hover:bg-medical-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" /> Ajouter un Fichier
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tous les Fichiers</CardTitle>
          <CardDescription>Documents médicaux des patients</CardDescription>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Rechercher un fichier..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select 
                value={patientFilter}
                onValueChange={setPatientFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les patients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les patients</SelectItem>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.prenom} {patient.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFiles.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>Aucun fichier trouvé</p>
              </div>
            ) : (
              filteredFiles.map(file => {
                const patient = patients.find(p => p.id === file.patient_id);
                const fileUrl = file.chemin_fichier.startsWith("/")
                  ? `http://localhost:5000${file.chemin_fichier}`
                  : file.chemin_fichier;
                return (
                  <Card key={file.id} className="overflow-hidden">
                    <div className="h-36 bg-medical-primary/10 flex items-center justify-center">
                      <div className="h-20 w-20 text-medical-primary">
                        {getFileIcon(file.type_fichier)}
                      </div>
                    </div>
                    <CardContent>
                      <h3 className="font-medium truncate" title={file.nom_fichier}>
                        {file.nom_fichier}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {patient?.prenom} {patient?.nom}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(file.date_upload), "dd MMM yyyy", { locale: fr })}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-700"
                            title="Prévisualiser"
                            onClick={() => handlePreviewFile(file)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <a
                            href={fileUrl}
                            download={file.nom_fichier}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-700"
                              title="Télécharger"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-medical-danger"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un fichier médical</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau document au dossier médical.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <Select 
                onValueChange={(value) => setNewFile({
                  ...newFile,
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
              <Label htmlFor="nom_fichier">Nom du fichier</Label>
              <Input
                id="nom_fichier"
                value={newFile.nom_fichier}
                onChange={(e) => setNewFile({ ...newFile, nom_fichier: e.target.value })}
                placeholder="Ex: Radiographie Thorax 2023"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Fichier</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setNewFile({
                      ...newFile,
                      file: e.target.files[0],
                      nom_fichier: e.target.files[0].name,
                      type_fichier: e.target.files[0].type,
                      chemin_fichier: `/uploads/${e.target.files[0].name}`
                    });
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Pour cette démo, aucun fichier n'est vraiment uploadé.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddFile}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Prévisualisation du fichier</DialogTitle>
            <DialogDescription>
              {previewFile?.nom_fichier}
            </DialogDescription>
          </DialogHeader>
          {previewError ? (
            <div className="text-red-500 text-center py-8">{previewError}</div>
          ) : previewFile ? (
            previewFile.type_fichier?.includes("image") ? (
              <img
                src={previewFile.chemin_fichier.startsWith("/") ? `http://localhost:5000${previewFile.chemin_fichier}` : previewFile.chemin_fichier}
                alt={previewFile.nom_fichier}
                className="max-h-[500px] mx-auto"
                onError={() => setPreviewError("Impossible d'afficher l'image.")}
              />
            ) : previewFile.type_fichier?.includes("pdf") ? (
              <embed
                src={previewFile.chemin_fichier.startsWith("/") ? `http://localhost:5000${previewFile.chemin_fichier}` : previewFile.chemin_fichier}
                type="application/pdf"
                width="100%"
                height="500px"
                onError={() => setPreviewError("Impossible d'afficher le PDF.")}
              />
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>Ce type de fichier ne peut pas être prévisualisé.</p>
              </div>
            )
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
