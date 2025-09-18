export interface Profile {
  _id?: string;
  name: string;
  email: string;
  age: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  age: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ProfileState {
  profile: Profile | null;
  profiles: Profile[];
  loading: boolean;
  error: string | null;
  success: string | null;
}
