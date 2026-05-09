import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TemplateModule } from './modules/template/template.module';
import { DesignModule } from './modules/design/design.module';
import { AiModule } from './modules/ai/ai.module';
import { CardModule } from './modules/card/card.module';
import { ShareModule } from './modules/share/share.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { PrintModule } from './modules/print/print.module';
import { PaymentModule } from './modules/payment/payment.module';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/quickcard'),
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        // CRITICAL: do not throw on initial connect failure — keep retrying
        bufferCommands: false,
        connectionFactory: (connection: any) => {
          connection.on('connected', () => console.log('✅ MongoDB connected'));
          connection.on('error', (err: any) => console.error('❌ MongoDB:', err.message));
          connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [{
        ttl: configService.get<number>('THROTTLE_TTL', 60) * 1000,
        limit: configService.get<number>('THROTTLE_LIMIT', 100),
      }],
      inject: [ConfigService],
    }),

    CloudinaryModule,
    HealthModule,
    AuthModule,
    UserModule,
    TemplateModule,
    DesignModule,
    AiModule,
    CardModule,
    ShareModule,
    SubscriptionModule,
    PrintModule,
    PaymentModule,
  ],
})
export class AppModule {}
