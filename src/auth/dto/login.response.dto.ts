import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/user/enum/userRole.enum';

export class LoginResponseDTO {
  @ApiProperty({
    name: 'access-token',
    type: 'string',
    example:
      'This is a token, same like eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  'access-token': string;

  @ApiProperty({
    name: 'refresh-token',
    type: 'string',
    example:
      'This is a token, same like eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  'refresh-token': string;

  @ApiProperty({ name: 'role', enum: UserRole, example: UserRole.USER })
  role: UserRole;
}
