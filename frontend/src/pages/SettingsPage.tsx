
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

export default function SettingsPage() {
  const { doctor } = useAuth();
  const [doctorInfo, setDoctorInfo] = useState({
    nom: doctor?.nom || "",
    prenom: doctor?.prenom || "",
    email: doctor?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the doctor's info
    toast.success("Informations personnelles mises à jour");
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!doctorInfo.currentPassword) {
      toast.error("Veuillez saisir votre mot de passe actuel");
      return;
    }
    
    if (doctorInfo.newPassword !== doctorInfo.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    // In a real app, this would update the password
    toast.success("Mot de passe mis à jour avec succès");
    
    setDoctorInfo({
      ...doctorInfo,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Paramètres</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations Personnelles</CardTitle>
            <CardDescription>
              Mettez à jour vos informations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={doctorInfo.prenom}
                    onChange={(e) => setDoctorInfo({ ...doctorInfo, prenom: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={doctorInfo.nom}
                    onChange={(e) => setDoctorInfo({ ...doctorInfo, nom: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={doctorInfo.email}
                  onChange={(e) => setDoctorInfo({ ...doctorInfo, email: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="bg-medical-primary hover:bg-medical-primary/90">
                Enregistrer
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Changer de Mot de Passe</CardTitle>
            <CardDescription>
              Mettez à jour votre mot de passe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={doctorInfo.currentPassword}
                  onChange={(e) => setDoctorInfo({ ...doctorInfo, currentPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={doctorInfo.newPassword}
                  onChange={(e) => setDoctorInfo({ ...doctorInfo, newPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={doctorInfo.confirmPassword}
                  onChange={(e) => setDoctorInfo({ ...doctorInfo, confirmPassword: e.target.value })}
                />
              </div>
              <Button type="submit">
                Changer le mot de passe
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du Système</CardTitle>
          <CardDescription>
            Configurez les paramètres généraux du système
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Notifications par Email</h3>
                <p className="text-sm text-muted-foreground">
                  Recevez des emails pour les nouveaux rendez-vous
                </p>
              </div>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medical-primary"></div>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Rappels de Rendez-vous</h3>
                <p className="text-sm text-muted-foreground">
                  Envoyer des rappels automatiques aux patients
                </p>
              </div>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medical-primary"></div>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Sauvegarde Automatique</h3>
                <p className="text-sm text-muted-foreground">
                  Sauvegarde quotidienne des données
                </p>
              </div>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medical-primary"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <Button className="w-full">
              Sauvegarder les paramètres
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
