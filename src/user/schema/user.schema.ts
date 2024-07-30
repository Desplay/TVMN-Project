import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from '../enum/userRole.enum';

export type UserDocument = UserEntity & Document;

@Schema({
  timestamps: false,
  collection: 'User',
})
export class UserEntity {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: UserEntity.name,
  })
  createdBy?: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  lastLogin: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'Department',
    required: false,
  })
  departmentId?: Types.ObjectId;

  @Prop({
    type: String,
    required: false,
  })
  refreshToken?: string;
}

const UserSchema = SchemaFactory.createForClass(UserEntity);

export { UserSchema };
