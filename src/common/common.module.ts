import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { MyJwtModule } from './my-jwt/my-jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env/.env', '.env/development.env'],
    }),
    DbModule,
    MyJwtModule,
  ],
})
export class CommonModule {}
