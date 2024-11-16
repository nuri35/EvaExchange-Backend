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
//   @Exclude()
//   @Column()
//   password?: string;

//   @BeforeInsert()
//   async encryptPassword() {
//     if (!this.password) return;
//     this.password = await PasswordProvider.setEncrypt(this.password);
//   }

//   @AfterInsert()
//   async deletePassword() {
//     this.password = undefined; // Şifre alanını temizle
//     delete this['password']; // Şifre alanını nesneden sil

//     return { ...this }; // Şifresiz nesneyi döndür
//   }
