import { Global, Module } from '@nestjs/common';
import { MyJwtService } from './my-jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET
          ? process.env.JWT_SECRET
          : 'secretKey',
        signOptions: {
          expiresIn: process.env.JWT_EXPIRESIN
            ? process.env.JWT_EXPIRESIN
            : '7d',
        },
      }),
    }),
  ],
  providers: [MyJwtService],
  exports: [MyJwtService],
})
export class MyJwtModule {}
