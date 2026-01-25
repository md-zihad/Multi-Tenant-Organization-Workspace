import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { Organization } from '../organization/Organization.entity.js';
import { Task } from '../task/Task.entity.js';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['organizationId'])

export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 50, default: 'MEMBER' })
  role!: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId!: string | null;

  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization | null;

  @OneToMany(() => Task, (task) => task.assignedUser)
  assignedTasks!: Task[];

  @OneToMany(() => Task, (task) => task.creator)
  createdTasks!: Task[];

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
