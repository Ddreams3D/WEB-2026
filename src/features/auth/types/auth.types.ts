export interface Address {
  id: string;
  label: string; // "Casa", "Trabajo", etc.
  recipientName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  photoURL?: string;
  role?: string;
  // Campos extendidos de perfil
  name?: string;
  phone?: string;
  phoneNumber?: string;
  address?: string; // Dirección principal (legacy)
  addresses?: Address[]; // Lista de direcciones
  favorites?: string[]; // Lista de IDs de productos favoritos
  birthDate?: string;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<{ success: boolean; isNewUser: boolean }>;
  logout: () => void;
  checkAuth: () => boolean;
  updateUser: (data: Partial<User>) => Promise<boolean>;
}
