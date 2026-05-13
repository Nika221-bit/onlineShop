export interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
  address: string;
  phone: string;
  zipCode: string;
  avatar: string;
  gender: 'MALE' | 'FEMALE';
}


export interface AuthResponse {
  id?: string;
  email?: string;
  token?: string;
  message?: string;
  user?: {
    id: string;
    email: string;
    fullName?: string;
  };
}
