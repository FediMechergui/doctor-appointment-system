import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Stethoscope } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/register";

export default function RegisterPage() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await axios.post(API_URL, {
        nom,
        prenom,
        email,
        mot_de_passe: motDePasse,
      });
      toast.success("Inscription réussie. Connectez-vous !");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="flex flex-col items-center">
            <div className="h-16 w-16 flex items-center justify-center bg-medical-primary text-white rounded-full mb-3">
              <Stethoscope size={32} />
            </div>
            <CardTitle>Inscription Médecin</CardTitle>
            <CardDescription>Créez votre compte pour accéder au tableau de bord</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="motDePasse">Mot de passe</Label>
                <Input id="motDePasse" type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-medical-primary hover:bg-medical-primary/90" disabled={isSubmitting}>
                {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-sm text-gray-500">
            Vous avez déjà un compte ?{' '}
            <Button variant="link" className="pl-1" onClick={() => navigate("/login")}>Se connecter</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
