import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/login.dto';
import { LoginResponseDTO } from './dto/login.response.dto';
import { AuthPipe } from './pipe/auth.pipe';
import { ApiResponses } from 'src/common/decorators/httpExceptions.decorator';
import { CustomResponseType } from 'src/common/enum/serviceResponse.enum';
import { SignUpDTO } from './dto/signup.dto';
import {
  AdminAPIDescription,
  PublicAPIDescription,
} from 'src/common/decorators/api.decorator';

@ApiTags('Auth')
@Controller('auth')
@ApiConsumes('application/json')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @PublicAPIDescription({
    summary: 'Đăng nhập',
    descriptions: [
      {
        status: 200,
        description: 'Đăng nhập thành công',
        type: LoginResponseDTO,
      },
    ],
  })
  @UsePipes(AuthPipe)
  async login(@Body() input: LoginDTO): Promise<LoginResponseDTO> {
    const result = await this.authService.login(input);
    if (result.status === CustomResponseType.ERROR) {
      throw new ForbiddenException(result.message);
    }
    return result.data;
  }

  @Post('signup')
  @AdminAPIDescription({
    summary: 'Đăng ký tài khoản (Admin)',
    descriptions: [
      {
        status: 200,
        description: 'Đăng ký thành công',
        type: LoginResponseDTO,
      },
      { status: 400, description: 'Email đã tồn tại' },
    ],
  })
  async signup(
    @Req() req: any,
    @Body() input: SignUpDTO,
  ): Promise<LoginResponseDTO> {
    const result = await this.authService.signup(req, input);
    if (result.status === CustomResponseType.ERROR) {
      throw new ForbiddenException(result.message);
    }
    return result.data;
  }

  @Post('refresh-token/:token')
  @ApiResponses('Lấy lại token mới', [
    {
      status: 200,
      description: 'Lấy lại token thành công',
      type: LoginResponseDTO,
    },
  ])
  async refreshToken(
    @Param('token') input: string,
  ): Promise<LoginResponseDTO> {
    const result = await this.authService.refreshToken(input);
    if (result.status === CustomResponseType.ERROR) {
      throw new ForbiddenException(result.message);
    }
    return result.data;
  }
}
