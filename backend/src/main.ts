import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Serve static files from uploads directory
  // In development, __dirname points to src/, in production to dist/
  // We always use relative to __dirname to ensure correct path
  const uploadsPath = join(process.cwd(), 'uploads');
app.useStaticAssets(uploadsPath, { prefix: '/uploads/' });


  console.log('Serving static files from:', uploadsPath);
  console.log('Static files will be available at: http://localhost:3000/uploads/');
  
  // Ensure the directory exists
  if (!existsSync(uploadsPath)) {
    mkdirSync(uploadsPath, { recursive: true });
    console.log('Created uploads directory:', uploadsPath);
  }
  
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
