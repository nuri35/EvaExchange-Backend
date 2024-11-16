import { Entity, Column, OneToMany } from 'typeorm';
import { BaseCustomEntity } from './base.entity';
import { Portfolio } from './portfolio.entity';
// import { Exclude } from 'class-transformer';
// import { PasswordProvider } from 'src/provider/password.provider';

@Entity('users')
export class User extends BaseCustomEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
  portfolios: Portfolio[];
}
