import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MyJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async createToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token);
  }
}
