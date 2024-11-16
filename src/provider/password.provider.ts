import { BadRequestException } from '@nestjs/common';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

export class PasswordProvider {
  private static scryptAsync = promisify(scrypt);
  constructor() {}
  static async setEncrypt(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const buf = await this.bufHandler(salt, password);
    return (password = `${buf.toString('hex')}.${salt}`);
  }

  private static async bufHandler(
    salt: string,
    password: string,
  ): Promise<Buffer> {
    const buf = (await this.scryptAsync(password, salt, 64)) as Buffer;
    return buf;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');

    const buf = await this.bufHandler(salt, suppliedPassword);

    if (!(buf.toString('hex') === hashedPassword)) {
      throw new BadRequestException('Invalid credentials');
    }
  }
}
