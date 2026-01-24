import * as userRepo from './user.repository.js';
import { hashPassword } from '../../utils/password.js';
import type { CreateUserDto, UserResponseDto } from './user.dto.js';

export async function createUser(role: string, data: CreateUserDto): Promise<UserResponseDto> {

  const existingUser = await userRepo.findByEmail(data.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await hashPassword(data.password);

  if (role === 'PLATFORM_ADMIN') {
    data.role = 'ORG_ADMIN';
  }

  const user = await userRepo.create({
    email: data.email.toLowerCase().trim(),
    password: hashedPassword,
    role: data.role || 'ORGANIZATION_MEMBER',
    organizationId: data.organizationId || null,
  });

  return {
    status: 201,
    message: 'User created successfully',
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  };
}

export async function getUserById(id: string): Promise<UserResponseDto> {
  const user = await userRepo.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  return {
    status: 200,
    message: 'User fetched successfully',
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  };
}

