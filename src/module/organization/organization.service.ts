import * as organizationRepo from './organization.repository.js';
import type { CreateOrganizationDto, OrganizationResponseDto } from './organization.dto.js';

export async function createOrganization(data: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    if (!data.slug) {
        throw new Error('Organization slug is required');
    }
    const existingOrganization = await organizationRepo.findBySlug(data.slug);
    if (existingOrganization) {
        throw new Error('Organization with this slug already exists');
    }

    const organization = await organizationRepo.create(data);
    return {
        status: 201,
        message: 'Organization created successfully',
        data: organization,
    };
}

