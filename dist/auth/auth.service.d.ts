import { JwtService } from '@nestjs/jwt';
export declare const USERS: {
    username: string;
    password: string;
    role: string;
}[];
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    login(userDto: any): Promise<{
        access_token: string;
    }>;
}
