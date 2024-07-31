import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { UserInput } from './entities/user.entity';
import { UserEntityToUser } from './user.pipe';
import { compareSync, hashSync } from 'bcrypt';
import { SignUpDTO } from 'src/auth/dto/signup.dto';
import { ServiceResponse } from 'src/common/entities/serviceResponse.entity';
import { CustomResponseType } from 'src/common/enum/serviceResponse.enum';
import { UserInputDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>,
  ) {}

  async create(
    input: SignUpDTO,
    adminId: string,
  ): Promise<ServiceResponse> {
    const user = await this.userModel.create(input);
    user.createdBy = new Types.ObjectId(adminId);
    try {
      user.password = hashSync(input.password, process.env.BCRYPT_SALT);
      await user.save();
    } catch (error) {
      Logger.error('UserService/create', error.message);
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

  async updateUser(
    userId: string,
    userInput: UserInputDTO,
  ): Promise<ServiceResponse> {
    const { oldPassword, password } = userInput;
    if (!oldPassword || !password) {
      return {
        status: CustomResponseType.ERROR,
        message: 'Mật khẩu cũ hoặc mật khẩu mới không được để trống',
      };
    }
    if (oldPassword && password) {
      try {
        const user = await this.userModel.findById(
          new Types.ObjectId(userId),
        );
        if (!compareSync(oldPassword, user.password)) {
          throw new Error('Mật khẩu cũ không đúng');
        }
        userInput.password = hashSync(
          password,
          Number(process.env.BCRYPT_SALT),
        );
      } catch (error) {
        Logger.error('Service/updateUser', error.message);
        return {
          status: CustomResponseType.ERROR,
          message: error.message
            ? error.message
            : 'Cập nhật thông tin thất bại',
        };
      }
    } else {
      delete userInput.password;
      delete userInput.oldPassword;
    }
    const user = await this.userModel.findByIdAndUpdate(
      new Types.ObjectId(userId),
      userInput,
    );
    return {
      status: CustomResponseType.SUCCESS,
      message: 'Cập nhật thông tin thành công',
      data: new UserEntityToUser().transform(user),
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
      Logger.error('UserService/updateRefreshToken', err.message);
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

  async getAllUsers(): Promise<ServiceResponse> {
    let users: UserEntity[];
    try {
      users = await this.userModel.find();
      if (!users) {
        throw new Error('Không có tài khoản nào');
      }
    } catch (error) {
      Logger.error('UserService/getAllUsers', error.message);
      return {
        status: CustomResponseType.ERROR,
        message: 'Lấy danh sách tài khoản thất bại',
      };
    }
    return {
      status: CustomResponseType.SUCCESS,
      message: 'Lấy danh sách tài khoản thành công',
      data: users.map((user) => new UserEntityToUser().transform(user)),
    };
  }

  async throwUserByUserId(userId: string): Promise<ServiceResponse> {
    let user: UserEntity;
    try {
      user = await this.userModel.findById(new Types.ObjectId(userId));
      if (!user) {
        throw new Error('Tài khoản không tồn tại');
      }
    } catch (error) {
      Logger.error('UserService/throwUserByUserId', error.message);
      return {
        status: CustomResponseType.ERROR,
        message: error.message,
      };
    }
    return {
      status: CustomResponseType.SUCCESS,
      message: 'Lấy thông tin tài khoản thành công',
      data: new UserEntityToUser().transform(user),
    };
  }

  async throwUserRoleByUserId(userId: string): Promise<string> {
    const user = await this.userModel.findById(new Types.ObjectId(userId));
    return user.role;
  }

  async deleteUser(userId: string): Promise<ServiceResponse> {
    let result: UserEntity;
    try {
      result = await this.userModel.findByIdAndDelete(
        new Types.ObjectId(userId),
      );
      if (!result) {
        throw new Error('Xóa tài khoản thất bại');
      }
    } catch (error) {
      Logger.error('UserService/deleteUser', error.message);
      return {
        status: CustomResponseType.ERROR,
        message: error.message,
      };
    } finally {
      return {
        status: CustomResponseType.SUCCESS,
        message: 'Xóa tài khoản thành công',
      };
    }
  }
}
