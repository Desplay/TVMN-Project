import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { User, UserInput } from './entities/user.entity';
import { UserEntityToUser } from './user.pipe';
import { compareSync, hashSync } from 'bcrypt';
import { SignUpDTO } from 'src/auth/dto/signup.dto';
import { ServiceResponse } from 'src/common/entities/serviceResponse.entity';
import { CustomResponseType } from 'src/common/enum/serviceResponse.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>,
  ) {}

  async create(input: SignUpDTO): Promise<ServiceResponse> {
    const user = await this.userModel.create(input);
    try {
      user.password = hashSync(input.password, process.env.BCRYPT_SALT);
      await user.save();
    } catch (error) {
      return {
        status: CustomResponseType.ERROR,
        message: 'Tạo tài khoản thất bại',
        data: error.message,
      };
    }
    return {
      status: CustomResponseType.SUCCESS,
      message: 'Tạo tài khoản thành công',
      data: new UserEntityToUser().transform(user),
    };
  }

  async verifyUser(userInput: UserInput): Promise<ServiceResponse> {
    const user = await this.userModel.findOne({
      $or: [
        { username: userInput.inputField },
        { email: userInput.inputField },
      ],
    });
    if (!user) {
      return {
        status: CustomResponseType.ERROR,
        message: 'Tài khoản không tồn tại',
      };
    }
    if (!compareSync(userInput.password, user.password)) {
      return {
        status: CustomResponseType.ERROR,
        message: 'Mật khẩu không đúng',
      };
    }
    if (!user.departmentId) {
      return {
        status: CustomResponseType.ERROR,
        message: 'Tài khoản chưa được phân phòng ban',
      };
    }
    user.lastLogin = new Date();
    await user.save();

    return {
      status: CustomResponseType.SUCCESS,
      message: 'Đăng nhập thành công',
      data: {
        userRole: user.role,
        userId: user._id,
      },
    };
  }

  async updateRefreshToken(
    userId: Types.ObjectId,
    refreshToken: string,
  ): Promise<ServiceResponse> {
    try {
      await this.userModel.findByIdAndUpdate(userId, {
        refreshToken: refreshToken,
      });
    } catch (err) {
      return {
        status: CustomResponseType.ERROR,
        message: 'Lưu refresh token thất bại',
        data: err.message,
      };
    }
    return {
      status: CustomResponseType.SUCCESS,
      message: 'Lưu refresh token thành công',
    };
  }

  async throwUserByUserId(userId: string): Promise<User> {
    const user = await this.userModel.findById(new Types.ObjectId(userId));
    return new UserEntityToUser().transform(user);
  }

  async throwUserRoleByUserId(userId: string): Promise<string> {
    const user = await this.userModel.findById(userId);
    return user.role;
  }
}
