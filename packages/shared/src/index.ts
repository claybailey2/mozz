// Types shared between frontend and backend

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

// Domain Types
export interface Topping {
  id: string;
  name: string;
  storeId: string;
  createdAt: Date;
}

export interface Pizza {
  id: string;
  name: string;
  storeId: string;
  createdBy: string;
  createdAt: Date;
  toppings: string[]; // Array of topping IDs
}

export interface Store {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
}

export * from './supabase'; // Exporting supabase client