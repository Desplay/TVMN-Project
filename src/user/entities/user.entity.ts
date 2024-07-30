import { Types } from 'mongoose';
import { UserRole } from '../enum/userRole.enum';

export class User {
  userId: Types.ObjectId;
  role: UserRole;
  username: string;
  email: string;
  fullName: string;
  createdAt: Date;
  createdBy?: Types.ObjectId;
  lastLogin: Date;
  departmentId?: Types.ObjectId;
  refreshToken?: string;
}

export class UserInput {
  inputField: string;
  password: string;
}
