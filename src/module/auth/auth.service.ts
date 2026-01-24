import * as userRepo from '../user/user.repository.js';
import { comparePassword } from '../../utils/password.js';
import { generateAccessToken } from '../../utils/jwt.js';
import { getJWTConfig } from '../../config/env.js';
import type { LoginDto, LoginResponseDto } from './auth.dto.js';

export async function login(data: LoginDto): Promise<LoginResponseDto> {
    const user = await userRepo.findByEmail(data.email);
    if (!user) {
        throw new Error('User with this email does not exist');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const jwtConfig = getJWTConfig();
    const accessToken = generateAccessToken(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId,
        },
        jwtConfig.expiresIn
    );

    return {
        status: 200,
        message: 'Login successful',
        accessToken,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId,
        }
    };
}