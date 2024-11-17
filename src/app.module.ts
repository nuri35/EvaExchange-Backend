import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmConfigService } from './config/db.config';
import { ExchangeModule } from './modules/exchange/exchange.module';
import { SeedModule } from './modules/seed/seed.module';
import { ShareModule } from './modules/share/share.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    SeedModule,
    ExchangeModule,
    ShareModule,
  ],

  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*'); // örnek ıcın eklendı tüm routelar için middleware uygulamak için örnegın.
  }
}
