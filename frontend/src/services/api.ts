
import axios from "axios";

// Base URL for API requests
const API_URL = "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// AUTH ENDPOINTS
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, mot_de_passe: password });
    return response.data;
  },
  register: async (nom: string, prenom: string, email: string, password: string) => {
    const response = await api.post("/auth/register", { 
      nom, 
      prenom, 
      email, 
      mot_de_passe: password 
    });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get("/doctors/me");
    if (response.status !== 200 || !response.data) {
      throw new Error("Profil non trouvé ou réponse invalide du serveur d'authentification.");
    }
    return response.data;
  }
};

// PATIENTS ENDPOINTS
export const patientsService = {
  getAll: async () => {
    const response = await api.get("/patients");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  create: async (patientData: any) => {
    const response = await api.post("/patients", patientData);
    return response.data;
  },
  update: async (id: number, patientData: any) => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  }
};

// APPOINTMENTS ENDPOINTS
export const appointmentsService = {
  getAll: async () => {
    const response = await api.get("/appointments");
    return response.data;
  },
  create: async (appointmentData: any) => {
    const response = await api.post("/appointments", appointmentData);
    return response.data;
  },
  update: async (id: number, appointmentData: any) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  }
};

// MEDICAL FILES ENDPOINTS
export const filesService = {
  getAllForPatient: async (patientId: number) => {
    const response = await api.get(`/files/${patientId}`);
    return response.data;
  },
  upload: async (patientId: number, file: File, fileName?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (fileName) {
      formData.append("nom_fichier", fileName);
    }
    
    const response = await api.post(`/files/${patientId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  rename: async (fileId: number, newName: string) => {
    const response = await api.put(`/files/rename/${fileId}`, { nouveau_nom: newName });
    return response.data;
  }
};

// ORDONNANCES ENDPOINTS
export const ordonnancesService = {
  getAllForPatient: async (patientId: number) => {
    const response = await api.get(`/ordonnances/${patientId}`);
    return response.data;
  },
  create: async (patientId: number, contenu: string) => {
    const response = await api.post(`/ordonnances/${patientId}`, { contenu });
    return response.data;
  }
};

export default api;
