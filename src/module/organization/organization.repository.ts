import { AppDataSource } from '../../config/db.js';
import { Organization } from './Organization.entity.js';

const getOrganizationRepository = () => AppDataSource.getRepository(Organization);

export async function create(organizationData: Partial<Organization>): Promise<Organization> {
  const repo = getOrganizationRepository();
  const organization = repo.create(organizationData);
  return repo.save(organization);
}

export async function findBySlug(slug: string): Promise<Organization | null> {
  const repo = getOrganizationRepository();
  return repo.findOne({ where: { slug } });
}

export async function findAll(): Promise<Organization[]> {
  const repo = getOrganizationRepository();
  return repo.find();
}