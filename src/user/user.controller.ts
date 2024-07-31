import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserDTO, UserInputDTO } from './dto/user.dto';
import { UserToUserDTO } from './user.pipe';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from './enum/userRole.enum';
import { ApiResponses } from 'src/common/decorators/httpExceptions.decorator';
import {
  AdminAndUserAPIDescription,
  AdminAPIDescription,
} from 'src/common/decorators/api.decorator';
import { CustomResponseType } from 'src/common/enum/serviceResponse.enum';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @AdminAndUserAPIDescription({
    summary: 'Lấy thông tin người dùng',
    descriptions: [
      {
        status: 200,
        description: 'Lấy thông tin người dùng thành công',
        type: UserDTO,
      },
      {
        status: 403,
        description: 'Không thể lấy thông tin người dùng',
      },
    ],
  })
  async getInfo(@Req() req: any): Promise<UserDTO> {
    try {
      const userId = req.user.userId;
      const user = await this.userService.throwUserByUserId(userId);
      return new UserToUserDTO().transform(user.data);
    } catch (error) {
      return error;
    }
  }

  @Get('all')
  @AdminAPIDescription({
    summary: 'Lấy danh sách người dùng',
    descriptions: [
      {
        status: 200,
        description: 'Lấy danh sách người dùng thành công',
        type: [UserDTO],
        isArray: true,
      },
      {
        status: 403,
        description: 'Không thể lấy danh sách người dùng',
      },
    ],
  })
  async getAllUsers(): Promise<UserDTO[]> {
    try {
      const users = await this.userService.getAllUsers();
      if (users.status === CustomResponseType.ERROR) {
        throw new Error(users.message);
      }
      return users.data.map((user) => new UserToUserDTO().transform(user));
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  @Put('update')
  @AdminAndUserAPIDescription({
    summary: 'Cập nhật thông tin người dùng',
    descriptions: [
      {
        status: 200,
        description: 'Cập nhật thông tin người dùng thành công',
        type: UserDTO,
      },
      {
        status: 403,
        description: 'Không thể cập nhật thông tin người dùng',
      },
    ],
  })
  async updateInfo(
    @Req() req: any,
    @Body() userInput: UserInputDTO,
  ): Promise<UserDTO> {
    try {
      const userId = req.user.userId;
      const user = await this.userService.updateUser(userId, userInput);
      if (user.status === CustomResponseType.ERROR) {
        throw new Error(user.message);
      }
      return new UserToUserDTO().transform(user.data);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  @Delete('delete/:id')
  @AdminAPIDescription({
    summary: 'Xóa người dùng',
    descriptions: [
      {
        status: 200,
        description: 'Xóa người dùng thành công',
      },
      {
        status: 403,
        description: 'Không thể xóa người dùng',
      },
    ],
  })
  async deleteUser(@Param('id') userId: string): Promise<string> {
    try {
      const user = await this.userService.deleteUser(userId);
      if (user.status === CustomResponseType.ERROR) {
        throw new Error(user.message);
      }
      return user.message;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
