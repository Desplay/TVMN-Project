import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/login.dto';
import { LoginResponseDTO } from './dto/login.response.dto';
import { AuthPipe } from './pipe/auth.pipe';
import { ApiResponses } from 'src/common/decorators/httpExceptions.decorator';
import { CustomResponseType } from 'src/common/enum/serviceResponse.enum';
import { SignUpDTO } from './dto/signup.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/user/enum/userRole.enum';
import { RolesGuard } from './guard/roles.guard';

@ApiTags('auth')
@Controller('auth')
@ApiConsumes('application/json')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponses('Đăng nhập vào hệ thống', [
    {
      status: 200,
      description: 'Đăng nhập thành công',
      type: LoginResponseDTO,
    },
    { status: 400, description: 'Sai thông tin tài khoản hoặc mật khẩu' },
    { status: 401, description: 'Tài khoản chưa được thêm vào phòng ban' },
  ])
  @UsePipes(AuthPipe)
  async login(@Body() input: LoginDTO): Promise<LoginResponseDTO> {
    const result = await this.authService.login(input);
    if (result.status === CustomResponseType.ERROR) {
      throw new ForbiddenException(result.message);
    }
    return result.data;
  }

  @Post('signup')
  @ApiBearerAuth()
  @ApiResponses('Admin tạo tài khoản mới', [
    {
      status: 200,
      description: 'Tạo tài khoản thành công',
      type: LoginResponseDTO,
    },
    { status: 400, description: 'Tài khoản đã tồn tại' },
  ])
  @Roles([UserRole.ADMIN])
  @UseGuards(RolesGuard)
  async signup(@Body() input: SignUpDTO): Promise<LoginResponseDTO> {
    const result = await this.authService.signup(input);
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
    { status: 400, description: 'Token không hợp lệ' },
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
