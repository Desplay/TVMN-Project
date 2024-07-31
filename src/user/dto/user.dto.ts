import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enum/userRole.enum';
import { Types } from 'mongoose';

class User {
  @ApiProperty({
    type: String,
    required: true,
    uniqueItems: true,
  })
  username: string;

  @ApiProperty({
    type: String,
    required: true,
    uniqueItems: true,
  })
  email: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  fullName: string;

  @ApiProperty({
    type: Types.ObjectId,
  })
  departmentId: Types.ObjectId;
}
export class UserDTO extends User {
  @ApiProperty({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    type: Types.ObjectId,
  })
  userId: Types.ObjectId;

  @ApiProperty({
    type: Date,
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    type: Types.ObjectId,
  })
  createdBy: Types.ObjectId;

  @ApiProperty({
    type: Date,
    required: true,
  })
  lastLogin: Date;
}

export class UserInputDTO extends User {
  @ApiProperty({
    type: String,
    required: true,
  })
  oldPassword: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  password: string;
}
