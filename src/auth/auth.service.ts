import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const USERS = [
  { username: 'admin', password: 'password', role: 'admin' },
  { username: 'normal', password: 'password', role: 'normal' },
  { username: 'limited', password: 'password', role: 'limited' },
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(userDto: any) {
    const user = USERS.find(
      (u) => u.username === userDto.username && u.password === userDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
