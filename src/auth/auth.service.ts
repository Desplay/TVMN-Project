import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDTO } from './dto/login.dto';
import { User, UserInput } from 'src/user/entities/user.entity';
import { MyJwtService } from 'src/common/my-jwt/my-jwt.service';
import { TokenType } from './enum/tokenType.enum';
import { CustomResponseType } from 'src/common/enum/serviceResponse.enum';
import { ServiceResponse } from 'src/common/entities/serviceResponse.entity';
import { UserRole } from 'src/user/enum/userRole.enum';
import { SignUpDTO } from './dto/signup.dto';
import { Payload } from './entities/payload.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly myJwtService: MyJwtService,
  ) {}

  async login(input: LoginDTO): Promise<ServiceResponse> {
    const userInput: UserInput = {
      inputField: input.username || input.email,
      password: input.password,
    };
    const verifyUser = await this.userService.verifyUser(userInput);
    if (verifyUser.status === CustomResponseType.ERROR) {
      return verifyUser;
    }

    const tokens = await this.createTokens(verifyUser.data);
    const saved_token = await this.userService.updateRefreshToken(
      verifyUser.data.userId,
      tokens['refresh-token'],
    );
    if (saved_token.status === CustomResponseType.ERROR) {
      return saved_token;
    }
    return {
      status: CustomResponseType.SUCCESS,
      message: verifyUser.message,
      data: {
        ...tokens,
        role: verifyUser.data.userRole,
      },
    };
  }

  async signup(input: SignUpDTO): Promise<ServiceResponse> {
    const user_created = await this.userService.create(input);
    if (user_created.status === CustomResponseType.ERROR) {
      return user_created;
    }
    return {
      status: CustomResponseType.SUCCESS,
      message: user_created.message,
    };
  }

  async refreshToken(refreshToken: string): Promise<ServiceResponse> {
    let payload: Payload;
    try {
      payload = await this.myJwtService.verifyToken(refreshToken);
    } catch (err) {
      return {
        status: CustomResponseType.ERROR,
        message: err.message,
      };
    }
    if (payload.type !== TokenType.REFRESH) {
      return {
        status: CustomResponseType.ERROR,
        message: 'Token không hợp lệ',
      };
    }
    const user = await this.userService.throwUserByUserId(payload.userId);

    if (!user.refreshToken || refreshToken !== user.refreshToken) {
      return {
        status: CustomResponseType.ERROR,
        message: 'Token không trùng khớp',
      };
    }
    if (payload.exp > new Date().getTime()) {
      return {
        status: CustomResponseType.ERROR,
        message: 'Token đã hết hạn',
      };
    }
    const tokens = await this.createTokens(user);
    await this.userService.updateRefreshToken(
      user.userId,
      tokens['refresh-token'],
    );
    return {
      status: CustomResponseType.SUCCESS,
      message: 'Lấy token mới thành công',
      data: {
        ...tokens,
        role: user.role,
      },
    };
  }

  private async createTokens(
    user: User,
  ): Promise<{ 'access-token': string; 'refresh-token': string }> {
    const accessToken = await this.myJwtService.createToken({
      userId: user.userId.toString(),
      userRole: user.role as UserRole,
      type: TokenType.ACCESS,
    });
    const refreshToken = await this.myJwtService.createToken({
      userId: user.userId.toString(),
      userRole: user.role as UserRole,
      type: TokenType.REFRESH,
    });
    return {
      'access-token': accessToken,
      'refresh-token': refreshToken,
    };
  }
}
