import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { Project } from '../project/Project.entity.js';
import { User } from '../user/User.entity.js';

@Entity('tasks')
@Index(['projectId'])
@Index(['assignedTo'])
@Index(['createdBy'])

export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status!: string;

  @Column({ type: 'varchar', length: 50, default: 'MEDIUM' })
  priority!: string;

  @Column({ type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @Column({ type: 'uuid', nullable: true })
  assignedTo!: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedTo' })
  assignedUser!: User | null;

  @Column({ type: 'uuid' })
  createdBy!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator!: User;

  @Column({ type: 'timestamp', nullable: true })
  dueDate!: Date | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
