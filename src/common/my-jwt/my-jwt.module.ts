import { Module } from '@nestjs/common';
import { MyJwtService } from './my-jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [MyJwtService],
})
export class MyJwtModule {}
