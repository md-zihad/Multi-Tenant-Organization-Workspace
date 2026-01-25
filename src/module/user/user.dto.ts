export interface CreateUserDto {
  email: string;
  password: string;
  role?: string;
  organizationId?: string | null;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
}

export interface UserResponseDto {
  status: number;
  message: string;
  data: {
    id: string;
    email: string;
    role: string;
    organizationId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
}
