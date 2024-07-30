import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, default: 'username' })
  username?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false, default: 'email@example.com' })
  email?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, default: 'username' })
  password: string;
}
