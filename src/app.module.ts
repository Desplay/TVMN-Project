import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CommonModule, UserModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
