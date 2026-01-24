import { AppDataSource } from '../../config/db.js';
import { Project } from './Project.entity.js';

const getProjectRepository = () => AppDataSource.getRepository(Project);

export async function create(projectData: Partial<Project>): Promise<Project> {
  const repo = getProjectRepository();
  const project = repo.create(projectData);
  return repo.save(project);
}

export async function findById(id: string): Promise<Project | null> {
  const repo = getProjectRepository();
  return repo.findOne({
    where: { id },
    relations: ['organization', 'creator'],
  });
}

export async function findByOrganization(organizationId: string): Promise<Project[]> {
  const repo = getProjectRepository();
  return repo.find({
    where: { organizationId },
    relations: ['organization', 'creator'],
    order: { createdAt: 'DESC' },
  });
}

export async function findByIdAndOrganization(
  id: string,
  organizationId: string
): Promise<Project | null> {
  const repo = getProjectRepository();
  return repo.findOne({
    where: { id, organizationId },
    relations: ['organization', 'creator'],
  });
}

export async function update(id: string, projectData: Partial<Project>): Promise<void> {
  const repo = getProjectRepository();
  await repo.update(id, projectData);
}
