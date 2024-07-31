import { Injectable, PipeTransform } from '@nestjs/common';
import { UserEntity } from './schema/user.schema';
import { User as UserEntityService } from './entities/user.entity';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserEntityToUser implements PipeTransform {
  transform(value: UserEntity): UserEntityService {
    const user: UserEntityService = {
      userId: value._id,
      role: value.role,
      username: value.username,
      email: value.email,
      fullName: value.fullName,
      createdAt: value.createdAt,
      createdBy: value.createdBy,
      lastLogin: value.lastLogin,
      departmentId: value.departmentId,
      refreshToken: value.refreshToken,
    };
    return user;
  }
}

@Injectable()
export class UserToUserDTO implements PipeTransform {
  transform(value: UserEntityService): UserDTO {
    const userDTO: UserDTO = {
      userId: value.userId,
      role: value.role,
      username: value.username,
      email: value.email,
      fullName: value.fullName,
      createdAt: value.createdAt,
      createdBy: value.createdBy,
      lastLogin: value.lastLogin,
      departmentId: value.departmentId,
    };
    return userDTO;
  }
}

export class UserPipe {
  userEntityToUser: UserEntityToUser;
}
