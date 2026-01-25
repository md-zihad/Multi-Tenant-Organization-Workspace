import { AppDataSource } from '../../config/db.js';
import { User } from './User.entity.js';

const getUserRepository = () => AppDataSource.getRepository(User);

export async function findByEmail(email: string): Promise<User | null> {
  const repo = getUserRepository();
  return repo.findOne({ where: { email: email.toLowerCase().trim() } });
}

export async function findById(id: string): Promise<User | null> {
  const repo = getUserRepository();
  return repo.findOne({ where: { id } });
}

export async function create(userData: Partial<User>): Promise<User> {
  const repo = getUserRepository();
  const user = repo.create(userData);
  return repo.save(user);
}

