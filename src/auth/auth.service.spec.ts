import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should return access_token for valid admin credentials', async () => {
    const result = await service.login({
      username: 'admin',
      password: 'password',
    });
    expect(result).toEqual({ access_token: 'mocked-token' });
    expect(jwtService.sign).toHaveBeenCalledWith({
      username: 'admin',
      role: 'admin',
    });
  });

  it('should throw UnauthorizedException for invalid credentials', async () => {
    await expect(
      service.login({ username: 'admin', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return correct role for normal user', async () => {
    await service.login({ username: 'normal', password: 'password' });
    expect(jwtService.sign).toHaveBeenCalledWith({
      username: 'normal',
      role: 'normal',
    });
  });
});
