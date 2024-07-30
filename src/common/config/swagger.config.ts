import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function createDocument(app: any) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('TMVN Project API')
    .setDescription('API for TMVN Project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  return SwaggerModule.setup('docs', app, document);
}
