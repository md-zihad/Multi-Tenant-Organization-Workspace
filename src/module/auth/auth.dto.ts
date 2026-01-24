export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  status: number;
  message: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    organizationId: string | null;
  };
}

export interface UserProfileResponseDto {
  status: number;
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
    organizationId: string | null;
  }
}
