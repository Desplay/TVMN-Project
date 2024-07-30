import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/user/enum/userRole.enum';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, default: 'admin' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, default: 'admin' })
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true, default: 'email@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, default: 'admin' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, enum: UserRole, default: 'ADMIN' })
  role: UserRole;
}
