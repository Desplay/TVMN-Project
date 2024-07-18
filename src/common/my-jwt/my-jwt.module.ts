import { Module } from '@nestjs/common';
import { MyJwtService } from './my-jwt.service';

@Module({
  providers: [MyJwtService],
})
export class MyJwtModule {}
