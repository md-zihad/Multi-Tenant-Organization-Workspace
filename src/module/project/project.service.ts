import * as projectRepo from './project.repository.js';
import type {
    CreateProjectDto,
    ProjectResponseDto,
    ProjectListResponseDto,
} from './project.dto.js';

export async function createProject(
    data: CreateProjectDto,
    caller: object
): Promise<ProjectResponseDto> {
    if ((caller as any).role !== 'ORG_ADMIN') {
        throw new Error('Only organization admins can create projects');
    }

    const organizationId = (caller as any).organizationId;
    const userId = (caller as any).id;

    if (!organizationId) {
        throw new Error('Organization admin must belong to an organization');
    }

    const project = await projectRepo.create({
        name: data.name,
        description: data.description ?? null,
        organizationId: organizationId,
        createdBy: userId,
        isActive: true,
    });

    return {
        status: 201,
        message: 'Project created successfully',
        data: {
            id: project.id,
            name: project.name,
            description: project.description,
            organizationId: project.organizationId,
            createdBy: project.createdBy,
            isActive: project.isActive,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        },
    };
}


export async function getProjectsForMyOrganization(
    caller: object
): Promise<ProjectListResponseDto> {
    if ((caller as any).role !== 'ORG_ADMIN') {
        throw new Error('Only organization admins can list projects');
    }
    if (!((caller as any).organizationId)) {
        throw new Error('Organization admin must belong to an organization');
    }
    const projects = await projectRepo.findByOrganization((caller as any).organizationId);
    return {
        status: 200,
        message: 'Projects fetched successfully',
        data: projects.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            organizationId: p.organizationId,
            createdBy: p.createdBy,
            isActive: p.isActive,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        })),
    };
}

// export async function updateProject(
//     id: string,
//     data: UpdateProjectDto,
//     caller: CallerContext
// ): Promise<ProjectResponseDto> {
//     if (caller.role !== 'ORG_ADMIN') {
//         throw new Error('Only organization admins can update projects');
//     }

//     const project = await projectRepo.findByIdAndOrganization(
//         id,
//         caller.organizationId!
//     );
//     if (!project) {
//         throw new Error('Project not found or you do not have access to it');
//     }

//     await projectRepo.update(id, data);

//     const updatedProject = await projectRepo.findById(id);
//     if (!updatedProject) {
//         throw new Error('Failed to fetch updated project');
//     }

//     return {
//         status: 200,
//         message: 'Project updated successfully',
//         data: {
//             id: updatedProject.id,
//             name: updatedProject.name,
//             description: updatedProject.description,
//             organizationId: updatedProject.organizationId,
//             createdBy: updatedProject.createdBy,
//             isActive: updatedProject.isActive,
//             createdAt: updatedProject.createdAt,
//             updatedAt: updatedProject.updatedAt,
//         },
//     };
// }
