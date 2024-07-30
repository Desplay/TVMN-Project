import { ValidationPipe } from '@nestjs/common';

export function createPipeConfig(app: any) {
  return app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
}
