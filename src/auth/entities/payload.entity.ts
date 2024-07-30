import { UserRole } from 'src/user/enum/userRole.enum';
import { TokenType } from '../enum/tokenType.enum';

export class Payload {
  userId: string;
  userRole: UserRole;
  type: TokenType;
  iat?: number;
  exp?: number;
}
