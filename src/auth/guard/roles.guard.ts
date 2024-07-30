import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/common/decorators/role.decorator';
import { MyJwtService } from 'src/common/my-jwt/my-jwt.service';
import { UserService } from 'src/user/user.service';
import { TokenType } from '../enum/tokenType.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly myJwtService: MyJwtService,
    private readonly userService: UserService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(
      Roles,
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    const payload = await this.myJwtService.verifyToken(token);
    request.user = payload;
    const userRole = await this.userService.throwUserRoleByUserId(
      payload.userId,
    );
    if (payload.type !== TokenType.ACCESS) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    if (!roles.includes(userRole)) {
      throw new UnauthorizedException('Không có quyền truy cập');
    }
    return true;
  }

  private extractToken(authorization: string) {
    const [type, token] = authorization.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    return token;
  }
}
