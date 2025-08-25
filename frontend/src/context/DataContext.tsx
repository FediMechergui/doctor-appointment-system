import React, { createContext, useContext, useState, useEffect } from 'react';

export type Patient = {
  id: number;
  nom: string;
  prenom: string;
  date_naissance?: string;
  sexe?: 'Homme' | 'Femme' | 'Autre';
  telephone?: string;
  email?: string;
  adresse?: string;
  allergies?: string;
  maladies_chroniques?: string;
  maladies_actuelles?: string;
  antecedents_medicaux?: string;
  medicaments_actuels?: string;
  autres_notes?: string;
};

export type Appointment = {
  id: number;
  doctor_id: number;
  patient_id: number;
  date_rdv: string;
  motif?: string;
  statut: 'à venir' | 'terminé' | 'annulé';
  note?: string;
  patient?: Patient;
};

export type MedicalFile = {
  id: number;
  patient_id: number;
  nom_fichier: string;
  chemin_fichier: string;
  type_fichier?: string;
  date_upload: string;
};

interface DataContextType {
  patients: Patient[];
  appointments: Appointment[];
  medicalFiles: MedicalFile[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  setMedicalFiles: React.Dispatch<React.SetStateAction<MedicalFile[]>>;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: number, patient: Partial<Patient>) => void;
  deletePatient: (id: number) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: number, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: number) => void;
  addMedicalFile: (fileObj: { file: File; patient_id: number; nom_fichier: string }) => void;
  deleteMedicalFile: (id: number) => void;
  getPatientById: (id: number) => Patient | undefined;
  getAppointmentsForPatient: (patientId: number) => Appointment[];
  getFilesForPatient: (patientId: number) => MedicalFile[];
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Patients
  const {
    data: patients = [],
    refetch: refetchPatients
  } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data } = await api.get('/patients');
      console.log('Fetched patients:', data);
      return data;
    }
  });

  const addPatientMutation = useMutation({
    mutationFn: (patient: Omit<Patient, 'id'>) => api.post('/patients', patient),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] })
  });

  const updatePatientMutation = useMutation({
    mutationFn: ({ id, patient }: { id: number; patient: Partial<Patient> }) => api.put(`/patients/${id}`, patient),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] })
  });

  const deletePatientMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/patients/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] })
  });

  // Appointments
  const {
    data: appointments = [],
    refetch: refetchAppointments
  } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data } = await api.get('/appointments');
      console.log('Fetched appointments:', data);
      return data;
    }
  });

  const addAppointmentMutation = useMutation({
    mutationFn: (appointment: Omit<Appointment, 'id'>) => api.post('/appointments', appointment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] })
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, appointment }: { id: number; appointment: Partial<Appointment> }) => api.put(`/appointments/${id}`, appointment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] })
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/appointments/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] })
  });

  // Medical Files
  const {
    data: medicalFiles = [],
    refetch: refetchFiles
  } = useQuery({
    queryKey: ['medicalFiles'],
    queryFn: async () => {
      const { data } = await api.get('/files');
      console.log('Fetched medical files:', data); // DEBUG
      return data;
    }
  });

  // Filter out files that do not exist in the uploads directory
  const [existingMedicalFiles, setExistingMedicalFiles] = useState<MedicalFile[]>([]);

  useEffect(() => {
    const backendUrl = "http://localhost:5000"; // Update this if your backend URL changes
    const checkFiles = async () => {
      if (!medicalFiles.length) {
        setExistingMedicalFiles([]);
        return;
      }
      const results = await Promise.all(
        medicalFiles.map(async (file) => {
          try {
            const url = file.chemin_fichier.startsWith("/")
              ? backendUrl + file.chemin_fichier
              : file.chemin_fichier;
            const res = await fetch(url, { method: 'HEAD' });
            return res.ok ? file : null;
          } catch {
            return null;
          }
        })
      );
      setExistingMedicalFiles(results.filter(Boolean) as MedicalFile[]);
    };
    checkFiles();
  }, [medicalFiles]);

  // File upload: expects a File object and patient_id
  const addMedicalFileMutation = useMutation({
    mutationFn: async (fileObj: { file: File; patient_id: number; nom_fichier: string }) => {
      const formData = new FormData();
      formData.append('file', fileObj.file);
      formData.append('nom_fichier', fileObj.nom_fichier);
      return api.post(`/files/${fileObj.patient_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medicalFiles'] })
  });

  const deleteMedicalFileMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/files/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medicalFiles'] })
  });


  // Helper getters (using query data)
  const getPatientById = (id: number) => patients.find(p => p.id === id);
  const getAppointmentsForPatient = (patientId: number) =>
    appointments.filter(a => a.patient_id === patientId).map(a => ({ ...a, patient: patients.find(p => p.id === a.patient_id) }));

  return (
    <DataContext.Provider
      value={{
        patients,
        appointments,
        medicalFiles: existingMedicalFiles,
        setPatients: () => {}, // Not used, but kept for typing compatibility
        setAppointments: () => {},
        setMedicalFiles: () => {},
        addPatient: (patient) => addPatientMutation.mutate(patient),
        updatePatient: (id, patient) => updatePatientMutation.mutate({ id, patient }),
        deletePatient: (id) => deletePatientMutation.mutate(id),
        addAppointment: (appointment) => addAppointmentMutation.mutate(appointment),
        updateAppointment: (id, appointment) => updateAppointmentMutation.mutate({ id, appointment }),
        deleteAppointment: (id) => deleteAppointmentMutation.mutate(id),
        addMedicalFile: (fileObj) => addMedicalFileMutation.mutate(fileObj),
        deleteMedicalFile: (id) => deleteMedicalFileMutation.mutate(id),
        getPatientById,
        getAppointmentsForPatient,
        getFilesForPatient: (patientId) => existingMedicalFiles.filter(f => f.patient_id === patientId),
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
