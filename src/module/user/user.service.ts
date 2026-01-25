import * as userRepo from './user.repository.js';
import { hashPassword } from '../../utils/password.js';
import type { CreateUserDto, UserResponseDto } from './user.dto.js';

export async function createUser(reqUser: object, data: CreateUserDto): Promise<UserResponseDto> {
  const existingUser = await userRepo.findByEmail(data.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await hashPassword(data.password);



  if ((reqUser as any).role === 'PLATFORM_ADMIN') {
    data.role = 'ORG_ADMIN';
  } else if ((reqUser as any).role === 'ORG_ADMIN') {
    data.organizationId = (reqUser as any).organizationId;
  }

  const user = await userRepo.create({
    email: data.email.toLowerCase().trim(),
    password: hashedPassword,
    role: data.role || 'MEMBER',
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



