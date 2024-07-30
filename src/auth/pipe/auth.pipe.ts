import {
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO } from '../dto/login.dto';

@Injectable()
export class AuthPipe implements PipeTransform {
  transform(value: LoginDTO): LoginDTO {
    if (
      (!value.username && !value.email) ||
      (value.username === '' && value.email === '')
    ) {
      throw new UnauthorizedException(
        'username hoặc email không được để trống',
      );
    }
    if (value.username && value.email) {
      throw new UnauthorizedException('chỉ được nhập username hoặc email');
    }
    return value;
  }
}
