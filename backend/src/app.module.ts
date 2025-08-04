import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose'; // 또는 import mongoose from 'mongoose';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { TemplateModule } from './template/template.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // public 폴더 기준
      serveRoot: '/', // 루트에서 제공
      exclude: ['/'], // index.html 만 컨트롤러에서, 나머지는 자동 제공
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const env = process.env.NODE_ENV;
        const uri =
          env === 'prod'
            ? configService.get<string>('PROD_MONGO_URI')
            : configService.get<string>('DEV_MONGO_URI');

        console.log('MongoDB 접속 주소:', uri);
        return { uri };
      },
      inject: [ConfigService],
    }),
    TemplateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    // 개발 환경에서만 쿼리로그 켜기
    if (process.env.MODE !== 'prod') {
      mongoose.set('debug', true);
    }
  }
}
