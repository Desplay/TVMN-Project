import { Injectable, PipeTransform } from '@nestjs/common';
import { UserEntity } from './schema/user.schema';
import { User } from './entities/user.entity';

@Injectable()
export class UserEntityToUser implements PipeTransform {
  transform(value: UserEntity): User {
    const user: User = {
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

export class UserPipe {
  userEntityToUser: UserEntityToUser;
}
