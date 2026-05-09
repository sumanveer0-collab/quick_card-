import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { UserService } from './modules/user/user.service';
import { TemplateService } from './modules/template/template.service';
import * as bcrypt from 'bcrypt';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    abortOnError: false,
  });

  const port = parseInt(process.env.PORT || '3001', 10);

  // Increase body size limit to handle base64 logo images (up to ~8 MB raw)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  app.setGlobalPrefix('api/v1');

  // Allow frontend on port 3000
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', '*'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(port);

  console.log(`\n🚀 QuickCard API: http://localhost:${port}/api/v1`);
  console.log(`   Health: http://localhost:${port}/api/v1/health`);

  // Seed data after startup
  await seedData(app);
}

async function seedData(app: any) {
  // Retry up to 5 times waiting for MongoDB to be ready
  for (let attempt = 1; attempt <= 5; attempt++) {
    await new Promise(r => setTimeout(r, 2000));
    try {
      const templateService = app.get(TemplateService);
      await templateService.seedDefaultTemplates();

      const userService = app.get(UserService);
      const DEMO_EMAIL = 'demo@quickcard.app';
      const DEMO_PASSWORD = 'Demo@1234';

      const existing = await userService.findByEmail(DEMO_EMAIL);
      if (!existing) {
        const hashed = await bcrypt.hash(DEMO_PASSWORD, 12);
        await userService.create({
          name: 'Demo User',
          email: DEMO_EMAIL,
          password: hashed,
        });
        console.log(`\n✅ Demo user created`);
      } else {
        console.log(`\n✅ Demo user ready`);
      }

      console.log(`🔑 Demo: demo@quickcard.app / Demo@1234\n`);
      return; // success
    } catch (e) {
      if (attempt < 5) {
        console.warn(`⏳ Seed attempt ${attempt} failed, retrying... (${e.message})`);
      } else {
        console.warn(`⚠️  Seed skipped after 5 attempts: ${e.message}`);
      }
    }
  }
}

bootstrap().catch(err => {
  console.error('Fatal startup error:', err.message);
  process.exit(1);
});
