import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createDocument } from './common/config/swagger.config';
import { createPipeConfig } from './common/config/pipe.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = await app.get(ConfigService);

  await createPipeConfig(app);
  await createDocument(app);

  const PORT = configService.get('PORT');
  await app.listen(PORT);
  console.log(`Server running on http://localhost:${PORT}`);
}
bootstrap();
