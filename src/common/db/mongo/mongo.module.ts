import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI
          ? process.env.MONGO_URI
          : 'mongodb://localhost:27017/nest',
      }),
    }),
  ],
})
export class MongoModule {}
